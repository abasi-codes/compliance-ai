"""RBAC permissions and role definitions."""

from enum import Enum
from functools import wraps
from typing import Callable


class Permission(str, Enum):
    """Available permissions in the system."""
    # Assessment permissions
    ASSESSMENT_CREATE = "assessment:create"
    ASSESSMENT_READ = "assessment:read"
    ASSESSMENT_UPDATE = "assessment:update"
    ASSESSMENT_DELETE = "assessment:delete"

    # Control permissions
    CONTROL_CREATE = "control:create"
    CONTROL_READ = "control:read"
    CONTROL_UPDATE = "control:update"
    CONTROL_DELETE = "control:delete"
    CONTROL_UPLOAD = "control:upload"

    # Policy permissions
    POLICY_CREATE = "policy:create"
    POLICY_READ = "policy:read"
    POLICY_UPDATE = "policy:update"
    POLICY_DELETE = "policy:delete"
    POLICY_UPLOAD = "policy:upload"

    # Mapping permissions
    MAPPING_GENERATE = "mapping:generate"
    MAPPING_APPROVE = "mapping:approve"
    MAPPING_READ = "mapping:read"

    # Interview permissions
    INTERVIEW_CREATE = "interview:create"
    INTERVIEW_CONDUCT = "interview:conduct"
    INTERVIEW_READ = "interview:read"

    # Score permissions
    SCORE_CALCULATE = "score:calculate"
    SCORE_READ = "score:read"

    # Report permissions
    REPORT_GENERATE = "report:generate"
    REPORT_READ = "report:read"

    # Admin permissions
    USER_MANAGE = "user:manage"
    SYSTEM_ADMIN = "system:admin"


# Role to permissions mapping
ROLE_PERMISSIONS: dict[str, set[Permission]] = {
    "admin": set(Permission),  # All permissions

    "compliance_manager": {
        Permission.ASSESSMENT_CREATE,
        Permission.ASSESSMENT_READ,
        Permission.ASSESSMENT_UPDATE,
        Permission.CONTROL_CREATE,
        Permission.CONTROL_READ,
        Permission.CONTROL_UPDATE,
        Permission.CONTROL_UPLOAD,
        Permission.POLICY_CREATE,
        Permission.POLICY_READ,
        Permission.POLICY_UPDATE,
        Permission.POLICY_UPLOAD,
        Permission.MAPPING_GENERATE,
        Permission.MAPPING_APPROVE,
        Permission.MAPPING_READ,
        Permission.INTERVIEW_CREATE,
        Permission.INTERVIEW_CONDUCT,
        Permission.INTERVIEW_READ,
        Permission.SCORE_CALCULATE,
        Permission.SCORE_READ,
        Permission.REPORT_GENERATE,
        Permission.REPORT_READ,
    },

    "consultant": {
        Permission.ASSESSMENT_READ,
        Permission.CONTROL_READ,
        Permission.POLICY_READ,
        Permission.MAPPING_READ,
        Permission.INTERVIEW_CREATE,
        Permission.INTERVIEW_CONDUCT,
        Permission.INTERVIEW_READ,
        Permission.SCORE_READ,
        Permission.REPORT_READ,
    },

    "control_owner": {
        Permission.ASSESSMENT_READ,
        Permission.CONTROL_READ,
        Permission.CONTROL_UPDATE,
        Permission.POLICY_READ,
        Permission.MAPPING_READ,
        Permission.INTERVIEW_CONDUCT,
        Permission.INTERVIEW_READ,
        Permission.SCORE_READ,
    },

    "viewer": {
        Permission.ASSESSMENT_READ,
        Permission.CONTROL_READ,
        Permission.POLICY_READ,
        Permission.MAPPING_READ,
        Permission.INTERVIEW_READ,
        Permission.SCORE_READ,
        Permission.REPORT_READ,
    },
}


def get_permissions_for_roles(role_names: list[str]) -> set[Permission]:
    """Get all permissions for a list of roles."""
    permissions = set()
    for role_name in role_names:
        if role_name in ROLE_PERMISSIONS:
            permissions.update(ROLE_PERMISSIONS[role_name])
    return permissions


def has_permission(user_roles: list[str], required_permission: Permission) -> bool:
    """Check if user roles include the required permission."""
    user_permissions = get_permissions_for_roles(user_roles)
    return required_permission in user_permissions


def has_any_permission(user_roles: list[str], required_permissions: list[Permission]) -> bool:
    """Check if user roles include any of the required permissions."""
    user_permissions = get_permissions_for_roles(user_roles)
    return bool(user_permissions.intersection(required_permissions))


def has_all_permissions(user_roles: list[str], required_permissions: list[Permission]) -> bool:
    """Check if user roles include all of the required permissions."""
    user_permissions = get_permissions_for_roles(user_roles)
    return all(p in user_permissions for p in required_permissions)

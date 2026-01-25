'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'compliance-ai-user-id';
// Test user ID - in production this would come from authentication
const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

function getOrCreateUserId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // For MVP, use the test user ID that exists in the database
  localStorage.setItem(USER_ID_KEY, TEST_USER_ID);
  return TEST_USER_ID;
}

export function useUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = getOrCreateUserId();
    if (id) {
      setUserId(id);
    }
  }, []);

  return userId;
}

export function getUserId(): string {
  return getOrCreateUserId();
}

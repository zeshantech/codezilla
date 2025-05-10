export const CURRENT_USER = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  bio: "Passionate programmer and algorithm enthusiast",
  avatarUrl:
    "https://st3.depositphotos.com/3431221/13621/v/450/depositphotos_136216036-stock-illustration-man-avatar-icon-hipster-character.jpg",
  joinedDate: "2023-01-10T00:00:00Z",
  problemsProgress: {
    "two-sum": {
      problemId: "two-sum",
      status: "solved",
      submissions: 3,
      lastSubmissionDate: "2023-01-15T10:30:00Z",
      timeTaken: 1200, // seconds
      code: {
        javascript: `function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map[complement] !== undefined) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
  }
  return [];
}`,
        python: "",
        java: "",
        cpp: "",
      },
    },
    "valid-parentheses": {
      problemId: "valid-parentheses",
      status: "attempted",
      submissions: 2,
      lastSubmissionDate: "2023-02-05T14:20:00Z",
      timeTaken: 900, // seconds
      code: {
        javascript: `function isValid(s) {
  const stack = [];
  const pairs = {
    '(': ')',
    '{': '}',
    '[': ']'
  };
  
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (pairs[char]) {
      stack.push(char);
    } else {
      const last = stack.pop();
      if (pairs[last] !== char) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}`,
        python: "",
        java: "",
        cpp: "",
      },
    },
    "longest-substring": {
      problemId: "longest-substring",
      status: "attempted",
      submissions: 1,
      lastSubmissionDate: "2023-03-12T09:45:00Z",
      timeTaken: 1500, // seconds
      code: {
        javascript: `function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let start = 0;
  let maxLen = 0;
  
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (seen.has(char)) {
      start = Math.max(start, seen.get(char) + 1);
    }
    seen.set(char, i);
    maxLen = Math.max(maxLen, i - start + 1);
  }
  
  return maxLen;
}`,
        python: "",
        java: "",
        cpp: "",
      },
    },
  },
  completedProblems: 12,
  completedCollections: 1,
  createdProblems: 2,
  createdCollections: 1,
  streak: 5,
  points: 1250,
};

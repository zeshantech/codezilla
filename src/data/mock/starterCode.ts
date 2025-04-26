import { ProgrammingLanguage } from "@/types";

export const getStarterCode = (
  problemId: string
): Record<ProgrammingLanguage, string> => {
  // Default starter code if the problem specific one is not found
  const defaultCode: Record<ProgrammingLanguage, string> = {
    javascript: `/**
 * Your solution here
 */
function solution(input) {
  // Write your code here
  
}`,
    python: `class Solution:
    def solution(self, input):
        # Write your code here
        pass`,
    java: `class Solution {
    public Object solution(Object input) {
        // Write your code here
        return null;
    }
}`,
    cpp: `class Solution {
public:
    void solution(int input) {
        // Write your code here
        
    }
};`,
  };

  // Problem-specific starter code
  const codeTemplates: Record<string, Record<ProgrammingLanguage, string>> = {
    "two-sum": {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your solution here
    
}`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your solution here
        pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        return new int[0];
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your solution here
        
    }
};`,
    },
    "valid-parentheses": {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Your solution here
    
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Your solution here
        pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Your solution here
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        // Your solution here
        
    }
};`,
    },
    "longest-substring": {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
    // Your solution here
    
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Your solution here
        pass`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Your solution here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Your solution here
        
    }
};`,
    },
    "merge-sorted-arrays": {
      javascript: `/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
function merge(nums1, m, nums2, n) {
    // Your solution here
    
}`,
      python: `class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        # Your solution here
        pass`,
      java: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        // Your solution here
        
    }
}`,
      cpp: `class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        // Your solution here
        
    }
};`,
    },
  };

  return codeTemplates[problemId] || defaultCode;
};

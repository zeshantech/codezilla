import { Problem } from "@/types";
import { getStarterCode } from "./starterCode";

export const PROBLEMS: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    testCases: [
      {
        input: "[2,7,11,15], 9",
        expectedOutput: "[0,1]",
      },
      {
        input: "[3,2,4], 6",
        expectedOutput: "[1,2]",
      },
      {
        input: "[3,3], 6",
        expectedOutput: "[0,1]",
      },
      {
        input: "[1,2,3,4,5], 9",
        expectedOutput: "[3,4]",
        isHidden: true,
      },
    ],
    starterCode: getStarterCode("two-sum"),
    popularity: 892,
    completionCount: 345,
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    isFeatured: false,
    tags: ["arrays", "hash-table", "beginner"],
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    category: "Stacks",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "The opening '(' is closed with a matching ')'.",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "Each opening bracket has a matching closing bracket.",
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "The opening '(' is closed with a non-matching ']'.",
      },
    ],
    testCases: [
      {
        input: '"()"',
        expectedOutput: "true",
      },
      {
        input: '"()[]{}"',
        expectedOutput: "true",
      },
      {
        input: '"(]"',
        expectedOutput: "false",
      },
      {
        input: '"([)]"',
        expectedOutput: "false",
      },
      {
        input: '"{[]}"',
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: getStarterCode("valid-parentheses"),
    popularity: 756,
    completionCount: 289,
    createdAt: "2023-02-10T15:30:00Z",
    updatedAt: "2023-02-10T15:30:00Z",
    isFeatured: true,
    tags: ["stacks", "strings", "beginner"],
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    category: "Strings",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: "The answer is 'abc', with the length of 3.",
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: "The answer is 'b', with the length of 1.",
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation:
          "The answer is 'wke', with the length of 3. Notice that the answer must be a substring, 'pwke' is a subsequence and not a substring.",
      },
    ],
    testCases: [
      {
        input: '"abcabcbb"',
        expectedOutput: "3",
      },
      {
        input: '"bbbbb"',
        expectedOutput: "1",
      },
      {
        input: '"pwwkew"',
        expectedOutput: "3",
      },
      {
        input: '""',
        expectedOutput: "0",
      },
      {
        input: '"aab"',
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    starterCode: getStarterCode("longest-substring"),
    popularity: 638,
    completionCount: 201,
    createdAt: "2023-03-05T09:45:00Z",
    updatedAt: "2023-03-05T09:45:00Z",
    isFeatured: true,
    tags: ["strings", "sliding-window", "hash-table", "intermediate"],
  },
  {
    id: "merge-sorted-arrays",
    title: "Merge Sorted Array",
    slug: "merge-sorted-array",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order. The final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.",
    constraints: [
      "nums1.length == m + n",
      "nums2.length == n",
      "0 <= m, n <= 200",
      "1 <= m + n <= 200",
      "-10^9 <= nums1[i], nums2[j] <= 10^9",
    ],
    examples: [
      {
        input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        output: "[1,2,2,3,5,6]",
        explanation:
          "The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6].",
      },
      {
        input: "nums1 = [1], m = 1, nums2 = [], n = 0",
        output: "[1]",
        explanation:
          "The arrays we are merging are [1] and []. The result of the merge is [1].",
      },
    ],
    testCases: [
      {
        input: "[1,2,3,0,0,0], 3, [2,5,6], 3",
        expectedOutput: "[1,2,2,3,5,6]",
      },
      {
        input: "[1], 1, [], 0",
        expectedOutput: "[1]",
      },
      {
        input: "[0], 0, [1], 1",
        expectedOutput: "[1]",
      },
      {
        input: "[4,5,6,0,0,0], 3, [1,2,3], 3",
        expectedOutput: "[1,2,3,4,5,6]",
        isHidden: true,
      },
    ],
    starterCode: getStarterCode("merge-sorted-arrays"),
    popularity: 584,
    completionCount: 245,
    createdAt: "2023-04-20T14:15:00Z",
    updatedAt: "2023-04-20T14:15:00Z",
    isFeatured: false,
    tags: ["arrays", "two-pointers", "sorting", "beginner"],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    slug: "binary-search",
    difficulty: "Easy",
    category: "Binary Search",
    description:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.",
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4.",
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1.",
      },
    ],
    testCases: [
      {
        input: "[-1,0,3,5,9,12], 9",
        expectedOutput: "4",
      },
      {
        input: "[-1,0,3,5,9,12], 2",
        expectedOutput: "-1",
      },
      {
        input: "[5], 5",
        expectedOutput: "0",
      },
      {
        input: "[1,2,3,4,5,6,7,8,9,10], 8",
        expectedOutput: "7",
        isHidden: true,
      },
    ],
    starterCode: getStarterCode("binary-search"),
    popularity: 521,
    completionCount: 278,
    createdAt: "2023-05-17T11:20:00Z",
    updatedAt: "2023-05-17T11:20:00Z",
    isFeatured: false,
    tags: ["binary-search", "arrays", "beginner"],
  },
  {
    id: "best-time-to-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation:
          "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5. Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.",
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation:
          "In this case, no transactions are done and the max profit = 0.",
      },
    ],
    testCases: [
      {
        input: "[7,1,5,3,6,4]",
        expectedOutput: "5",
      },
      {
        input: "[7,6,4,3,1]",
        expectedOutput: "0",
      },
      {
        input: "[2,4,1]",
        expectedOutput: "2",
      },
      {
        input: "[2,1,2,1,0,1,2]",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    starterCode: getStarterCode("best-time-to-buy-sell-stock"),
    popularity: 735,
    completionCount: 412,
    createdAt: "2023-06-08T16:50:00Z",
    updatedAt: "2023-06-08T16:50:00Z",
    isFeatured: true,
    tags: ["dynamic-programming", "arrays", "beginner"],
  },
];

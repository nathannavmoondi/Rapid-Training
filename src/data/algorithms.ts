interface Algorithm {
    id: string;
    title: string;
    description: string;
    code: string;
    language: 'csharp' | 'javascript';
}

export const algorithms: Algorithm[] = [
    {
        id: 'reverse-string-cs',
        title: 'Reverse a String',
        description: 'A C# implementation that reverses a string. For example, "apple" becomes "elppa". Uses Array.Reverse() method to efficiently reverse a character array.',
        code: `//reverse a string.  apple = 'elppa'
public static class StringReversal
{
    public static string ReverseString(string str)
    {
        //convert string to char array                
        char[] charArray = str.ToCharArray();
        //use Array static method to reverse array
        Array.Reverse(charArray);
        //create new string
        return new string(charArray);
    }
}`,
        language: 'csharp'
    },
    {
        id: 'anagrams-cs',
        title: 'Anagrams',
        description: 'Check if two strings are anagrams of each other. One string is an anagram of another if it uses the same characters, ignoring spaces and punctuation. For example, "rail safety" is an anagram of "fairy tales", and "RAIL! SAFETY!" is also an anagram of "fairy tales".',
        code: `//check to see if two strings are anagrams.  one string is an anagram of another if
// if it uses the same characters. Only consider characters, not spaces or punctuaqtion.
// returns true or false if anagrams

// anagrams('rail safety', 'fairy tales') = true
// anagrams('RAIL! SAFETY!', 'fairy tales') = true
// anagrams('Hi there', 'bye there') = false

using System;
using System.Collections.Generic;

public static class Anagrams{

    public static bool AreAnagrams(string str1, string str2)
    {
        //first compare same size
        if (str1.Length != str2.Length)
        {
            return false;
        }

        //one map solution. can also build two maps and compare values of each key

        //dictionary of each letter and how many times it appears
        Dictionary<char, int> charCount = new Dictionary<char, int>();

        //build map
        //add to dict 1 by 1
        foreach (char c in str1)
        {
            if (char.IsLetter(c)) //only letters
            {
                if (charCount.ContainsKey(c))
                {
                    charCount[c]++;
                }
                else
                {
                    charCount[c] = 1;
                }
            }
        }

       //work on other string, reducing char count each time encountered
       foreach (char c in str2)
        {
            if (char.IsLetter(c)) //tip: just use onlyAlpha() above
            {
                if (charCount.ContainsKey(c))
                {
                    charCount[c]--;
                    if (charCount[c] == 0)
                    {
                        charCount.Remove(c);
                    }
                }
                else
                {
                    return false;
                }
            }
        }

        //if all chars removed from other string, both are anagrams
        return charCount.Count == 0;
    }

    public static Dictionary<char, int> buildMap(string t) //can use this also
    {
        Dictionary<char, int> map = new Dictionary<char, int>();

        foreach (var c in t)
        {
            if (char.IsLetter(c))
            {
                if (map.ContainsKey(c))
                {
                    map[c]++;
                }
                else
                {
                    map[c] = 1;
                }
            }
        }
        return map;
    }

    //another solution
    public static bool isAnagram(string first, string second)
    {
        var temp = onlyAlpha(second);
        var tempfirst = onlyAlpha(first);
        if (tempfirst.Length != temp.Length)
            return false;
        foreach (var c in tempfirst)
        {
            if (temp.Contains(c))
            {
                var pos = temp.IndexOf(c);
                temp = temp.Substring(0, pos) + temp.Substring(pos + 1);
            }
            else
                return false;
        }

        return true;
    }

    public static string onlyAlpha(string t)
    {
        var result = "";
        foreach (var c in t)
        {
            if (char.IsLetter(c))
            {
                result += c;
            }
        }
        return result.ToUpper();
    }
}`,
        language: 'csharp'
    },
    {
        id: 'fizzbuzz-cs',
        title: 'FizzBuzz',
        description: 'Classic FizzBuzz implementation. Print numbers from 1 to n, replacing multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz".',
        code: `public class FizzBuzz {
    public static List<string> Generate(int n) {
        var result = new List<string>();
        
        for (int i = 1; i <= n; i++) {
            if (i % 3 == 0 && i % 5 == 0)
                result.Add("FizzBuzz");
            else if (i % 3 == 0)
                result.Add("Fizz");
            else if (i % 5 == 0)
                result.Add("Buzz");
            else
                result.Add(i.ToString());
        }
        
        return result;
    }
}`,
        language: 'csharp'
    },
    {
        id: 'palindrome-cs',
        title: 'Palindrome',
        description: 'Check if a string is a palindrome (reads the same forwards and backwards), ignoring case and non-alphanumeric characters.',
        code: `public class PalindromeChecker {
    public static bool IsPalindrome(string str) {
        string cleaned = new string(str.ToLower()
            .Where(c => char.IsLetterOrDigit(c))
            .ToArray());
            
        return cleaned == new string(cleaned.Reverse().ToArray());
    }
}`,
        language: 'csharp'
    },
    {
        id: 'array-chunks-cs',
        title: 'Array Chunks',
        description: 'Given an array and chunk size, divide the array into many subarrays where each subarray is of the specified length. The last chunk might be smaller if the array length is not evenly divisible by the chunk size.',
        code: `using System;
using System.Collections.Generic;
using System.Linq;

public static class ArrayChunk {
    public static List<int[]> ChunkArray(int[] arr, int size)
    {
        if (arr == null || size <= 0)
        {
            throw new ArgumentException("Invalid input");
        }

        //list of integer arrays eg: [1,2], [3,4] ,etc.
        List<int[]> result = new();

        for (int i = 0; i < arr.Length; i += size)
        {
            //go one by one, incrementing by size.
            //use take method to grab X integers and add to list via "Toarray"
            //eg: skip 2, get 3 and 4 (2 if possible), conver to array, add to result
            result.Add(arr.Skip(i).Take(size).ToArray());
        }

        return result;
    }

    public static List<int[]> ChunkArray2(int[] arr, int size)
    {
        List<int[]> chunked = new List<int[]>();
        List<int> chunk = new List<int>();
        int count = 0;
        foreach (int i in arr)
        {
            chunk.Add(i);
            if (chunk.Count == size) //array is at chunk size, add
            {
                chunked.Add(chunk.ToArray()); //adding array not list. convert list of int to array of int
                chunk.Clear();
            }
            count++;
            if (count == arr.Length) //reached last element
            {
                chunked.Add(chunk.ToArray());
                chunk.Clear();
            }
        }
        return chunked;
    }
}`,
        language: 'csharp'
    },
    {
        id: 'binary-gap-cs',
        title: 'Binary Gap',
        description: 'Find the longest sequence of consecutive zeros that is surrounded by ones in the binary representation of an integer N. For example, the number 1041 has binary representation 10000010001 and contains two binary gaps: one of length 5 and one of length 3. The function returns the length of the longest binary gap.',
        code: `using System;

public static class BinaryGap
{
    public static int LongestBinaryGap(int N)
    {
        //get binary string
        string binary = Convert.ToString(N, 2);

        int maxGap = 0;
        int currentGap = 0;
    //    bool counting = false;

        foreach (char c in binary)
        {
            if (c == '1')
            {
                    maxGap = Math.Max(maxGap, currentGap); //which is bigger so far current or past gap?
                    currentGap = 0;                
            //    counting = true;
            }
            else //if (counting)
            {
                currentGap++; //saw 0, keep going
            }
        }

        return maxGap;
    }
}`,
        language: 'csharp'
    },
    {
        id: 'count-vowels-cs',
        title: 'Count Vowels',
        description: 'Count the number of vowels (a, e, i, o, u) in a given string. For example, "Hi there" contains 3 vowels, while "Why?" contains 0 vowels. The function handles both uppercase and lowercase vowels.',
        code: `public static class GetYourVowels
{
    public static int CountVowels(string str)
    {
        int count = 0;
        //or array char[] vowels = ['a','e'];
        HashSet<char> vowels = new HashSet<char> { 'a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U' };

        foreach (char c in str)
        {
            if (vowels.Contains(c))
            {
                count++;
            }
        }

        return count;
    }
}`,
        language: 'csharp'
    },
    {
        id: 'missing-integer-cs',
        title: 'Missing Integer',
        description: 'Find the minimal positive integer not occurring in a given sequence. For example, given array [1, 3, 6, 4, 1, 2], the function returns 5 as it is the smallest positive integer that does not appear in the array.',
        code: `using System;
using System.Collections.Generic;

public static class MissingInteger
{
    public static int FindMinimalPositiveInteger(int[] A)
    {
        List<int> set = new List<int>(); //or hashset which is faster

        //add to hashset. unique values.
        foreach (int num in A)
        {
            set.Add(num);
        }

        int result = 1;
        while (set.Contains(result))
        {
            //starting from 1, if contgains next number - keep incrementing.  Otherwise return.
            result++;
        }

        return result;
    }
}`,
        language: 'csharp'
    },
    {
        id: 'permutation-cs',
        title: 'Permutation',
        description: 'Check if an array is a permutation. A permutation is a sequence containing each element from 1 to N once, and only once. For example, [4,1,3,2] is a permutation, but [4,1,3] is not.',
        code: `public static class Permutation
{
    public static bool IsPermutation(int[] A)
    {
        List<int> set = new List<int>();

        foreach (int num in A)
        {
            //check N not greater than size of array and also not contains duplicates
            if (num < 1 || num > A.Length || set.Contains(num))
            {
                return false;
            }
            set.Add(num);
        }

        return true;
    }
}`,
        language: 'csharp'
    },
    {
        id: 'max-chars-js',
        title: 'Max Characters',
        description: 'Given a string, return the character that is most commonly used in the string. For example, "aabbccccd" returns "c" and "apple 12311111" returns "1".',
        code: `//given a string, return the character that is most commonly used in the string

//maxchar('aabbccccd') = c
//maxchar('apple 12311111') == 1

function test1(str) {
     const charMap = {};
     let max = 0;
     let maxChar = '';
     
     for(let char of str){ //build character map        
        charMap[char] = charMap[char] +1 || 1; //if null
     }

     for( let char in charMap) //Use i to iterate cuz we are using an object.
     {
         if (charMap[char] > max){
             max = charMap[char];
             maxChar = char;
         }
     }

     return maxChar;
}

// Example usage:
console.log(test1('aabbccccd')); // Returns 'c'
console.log(test1('apple 12311111')); // Returns '1'

module.exports = test1;`,
        language: 'javascript'
    },
    {
        id: 'reverseint-js',
        title: 'Reverse Integer',
        description: 'Reverse the digits of an integer while maintaining the sign.',
        code: `function reverseInt(n) {
    const reversed = parseInt(
        Math.abs(n)
            .toString()
            .split('')
            .reverse()
            .join('')
    );
    
    return Math.sign(n) * reversed;
}`,
        language: 'javascript'
    },
    {
        id: 'biggest-number-js',
        title: 'Biggest Number',
        description: 'Find the largest number in an array using different methods.',
        code: `// Using Math.max
function findBiggestNumber(arr) {
    return Math.max(...arr);
}

// Using reduce
function findBiggestNumberReduce(arr) {
    return arr.reduce((max, current) => {
        return current > max ? current : max;
    }, arr[0]);
}

// Using sort
function findBiggestNumberSort(arr) {
    return arr.sort((a, b) => b - a)[0];
}`,
        language: 'javascript'
    },
    {
        id: 'binary-gap-js',
        title: 'Binary Gap',
        description: 'Find the longest sequence of consecutive zeros that is surrounded by ones in the binary representation of a number N. For example, binary 9 (1001) contains a binary gap of 2, and 529 (1000010001) contains two binary gaps: one of length 4 and one of length 3.',
        code: `//a binary gap within a positive integer N is any maximal
// sequence of consecutive zeroes that is surrounded by both ends in the binary
// representation of N.

//for ex: binary 9 has binary rep of 1001 and contains a binary gap of 2.  The number 529
// has gap of 1000010001 and contains two binary gaps: one of length 4 and one of length 3.

//write a function that returns legnth of it's LONGEST binary gap.  The function should
//return 0 if N doesn't contain a binary gap

//ex: N = 1041 should return 5.  Because N has binary rep of 1000001001 and so it's
//longest binary gap is length 5.

function solution1(num){
    //convert to binary
    //from 1 to n
    //if 0, increase gap
    //if 1, zero gap

    let bstr = num.toString(2);

    console.log(bstr);

    let gap = 0;
    let maxgap = 0;
    for (let c of bstr)
    {
        if (c == '0') gap++;
        else{            
            if (gap > maxgap)
            maxgap = gap;
            gap = 0;
        }
    }

    return maxgap; 
}

buildMap = (str)=> {

    let obj = {};
    for (let c of str){

        if (obj[c])
            obj[c] = obj[c] + 1;
        else
            obj[c] = 1;    
    }

    return obj;

}

// Example usage:
console.log(solution1(1041)); // Returns 5

module.exports = solution1;`,
        language: 'javascript'
    },
    {
        id: 'sentence-capitalization-cs',
        title: 'Sentence Capitalization',
        description: 'A function that capitalizes the first letter of each word in a sentence. For example, "a short sentence" becomes "A Short Sentence". The implementation shows both a culture-aware approach using TextInfo and a manual character-by-character implementation.',
        code: `using System.Globalization;

public static class SentenceCapitalization
{
    public static string CapitalizeFirstLetter(string input)
    {
        //TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
        //return textInfo.ToTitleCase(str);

        //or split into multiple words
        //add them together with a ' ' and then capitalize the first letter

        var output = input.Substring(0, 1).ToUpper();

        for (int i = 1; i < input.Length; i++)
        {
            if (input[i - 1] == ' ')
                output += input.Substring(i, 1).ToUpper();
            else
                output += input.Substring(i, 1);
        }
        return output;
    }
}`,
        language: 'csharp'
    },
    {
        id: 'char-limit-js',
        title: 'Character Limit',
        description: 'Write a function that takes a string and an integer i. Return a string where no character appears more than i times consecutively. For example, "aaaabbbacccbbbdv" with limit 2 returns "aabbaccbbdv", "avcd" with limit 1 returns "avcd".',
        code: `// Write a function that take a string, s, and an integer, i. Return a string where no character appears more than i times consecutively.
// ex "aaaabbbacccbbbdv", 2 => "aabbaccbbdv"
// "avcd", 1 => "avcd"
// "aaabbbbbaaa", 4 => "aaabbbbaaa"

function foo(str, num)
{
    let lastchar = '';
    let lastamount = 0;

    let output = "";

    for (let c of str){

        if (c == lastchar){
            lastamount++;
            if (lastamount < num)
                output += c;
        } else{
                lastchar = c; 
                output += c;
                lastamount = 0;        

        }
    }

    return output;
}

// Example usage:
console.log(foo("aaaabbbbacccbbbdv",2));  //aabbaccbbdv`,
        language: 'javascript'
    },
    {
        id: 'count-divisibles-js',
        title: 'Count Divisibles',
        description: 'Given a range of numbers from A to B and an integer K, count how many numbers within that range are evenly divisible by K. For example, given A=6, B=11, K=2, the function returns 3 because there are three numbers (6, 8, 10) that are divisible by 2 in that range.',
        code: `function countDivisiblesInRange(A, B, K) {
    let count = 0;
    
    // Start from first number divisible by K in the range
    const start = Math.ceil(A / K) * K;
    
    // Iterate through range counting numbers divisible by K
    for (let i = start; i <= B; i += K) {
        count++;
    }
    
    return count;
}

// Alternate more efficient solution using math
function countDivisiblesInRangeMath(A, B, K) {
    // Find first and last numbers divisible by K in range
    const start = Math.ceil(A / K);
    const end = Math.floor(B / K);
    
    // Count is simply the difference plus 1 (inclusive)
    return end - start + 1;
}`,
        language: 'javascript'
    },
    {
        id: 'fibonacci-cs',
        title: 'Fibonacci Sequence',
        description: 'Generate the Fibonacci sequence up to the nth number. The Fibonacci sequence is a series where each number is the sum of the preceding two numbers. For example, the first 10 numbers are: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34].',
        code: `public static class Fibonacci
{
    public static int[] GenerateFibonacci(int n)
    {
        if (n < 0)
            throw new ArgumentException("Input must be non-negative");
            
        int[] sequence = new int[n + 1];
        
        // Handle base cases
        if (n >= 0)
            sequence[0] = 0;
        if (n >= 1)
            sequence[1] = 1;
            
        // Generate subsequent numbers
        for (int i = 2; i <= n; i++)
        {
            sequence[i] = sequence[i - 1] + sequence[i - 2];
        }
        
        return sequence;
    }
    
    // Alternative method to get just the nth number
    public static int GetNthFibonacci(int n)
    {
        if (n < 0)
            throw new ArgumentException("Input must be non-negative");
            
        if (n <= 1)
            return n;
            
        return GetNthFibonacci(n - 1) + GetNthFibonacci(n - 2);
    }
}`,
        language: 'csharp'
    },
    {
        id: 'fibonacci-js',
        title: 'Fibonacci Sequence',
        description: 'Generate the Fibonacci sequence up to the nth number. The Fibonacci sequence is a series where each number is the sum of the preceding two numbers. For example, the first 10 numbers are: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34].',
        code: `function generateFibonacci(n) {
    let sequence = [0, 1];
    
    for (let i = 2; i <= n; i++) {
        sequence[i] = sequence[i-1] + sequence[i-2];
    }
    
    return sequence;
}

// Alternative version to get just the nth number
function getNthFibonacci(n) {
    if (n <= 1) return n;
    
    let prev = 0;
    let current = 1;
    
    for (let i = 2; i <= n; i++) {
        const next = prev + current;
        prev = current;
        current = next;
    }
    
    return current;
}`,
        language: 'javascript'
    },
    {
        id: 'steps-pattern-js',
        title: 'Steps Pattern',
        description: 'Generate a step shape pattern with n levels using the # character. For example, steps(3) prints:\n#  \n## \n###',
        code: `// Iterative solution
function generateSteps(n) {
    for (let row = 0; row < n; row++) {
        let stair = "";
        
        for (let col = 0; col < n; col++) {
            stair += col <= row ? "#" : " ";
        }
        console.log(stair);
    }
}

// Recursive solution
function generateStepsRecursive(n, row = 0, stair = '') {
    if (row === n) {
        return;
    }
    
    if (stair.length === n) {
        console.log(stair);
        return generateStepsRecursive(n, row + 1);
    }
    
    stair += stair.length <= row ? '#' : ' ';
    generateStepsRecursive(n, row, stair);
}`,
        language: 'javascript'
    },
    {
        id: 'missing-integer-js',
        title: 'Missing Integer',
        description: 'Find the minimal positive integer not occurring in a given sequence. For example, given array [1, 3, 6, 4, 1, 2], the function returns 5 as it is the smallest positive integer that does not appear in the array.',
        code: `function findMinimalMissingInteger(arr) {
    // Filter out non-positive numbers and duplicates
    const positiveNums = new Set(arr.filter(num => num > 0));
    
    // Start checking from 1
    let i = 1;
    while (positiveNums.has(i)) {
        i++;
    }
    
    return i;
}

// Alternative implementation using array marking
function findMinimalMissingIntegerMarking(arr) {
    // Create array to mark presence of numbers
    const present = new Array(arr.length + 1).fill(false);
    
    // Mark numbers that exist in array
    for (const num of arr) {
        if (num > 0 && num <= arr.length) {
            present[num] = true;
        }
    }
    
    // Find first unmarked positive integer
    for (let i = 1; i <= arr.length; i++) {
        if (!present[i]) {
            return i;
        }
    }
    
    // If all numbers from 1 to N exist, return N+1
    return arr.length + 1;
}`,
        language: 'javascript'
    },
    {
        id: 'reverse-integer-cs',
        title: 'Reverse Integer',
        description: 'Given an integer, return an integer that is the reverse of the input. For example: 15 becomes 51, 981 becomes 189, -15 becomes -51, -90 becomes -9. The implementation shows both a string-based and mathematical approach.',
        code: `//given a integer return an integer that is the reverse
//eg 15 = 51, 981 = 189, -15 = -51, -90 = -9

public static class ReverseInt
{
    public static int ReverseInteger(int n)
    {
        //make absolute
        //convert to string
        //convert to char array
        //reverse array
        //convert back to string
        //convert to int
        //check for less than 0 and multiply by -1 if so.
        var input = Math.Abs(n);

        char[] array = input.ToString().ToCharArray();
        Array.Reverse(array);
        var str = new String(array);
        var num = int.Parse(str);
        if (n < 0) num *= -1;
        return num;
    }

    // Alternative implementation using mathematical approach
    public static int ReverseInteger2(int n)
    {
        int reversed = 0;
        int input = Math.Abs(n);
        
        while (input != 0)
        {
            int digit = input % 10;
            reversed = reversed * 10 + digit;
            input /= 10;
        }
        
        return n < 0 ? -reversed : reversed;
    }
}`,
        language: 'csharp'
    }
];
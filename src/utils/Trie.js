class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.fullName = null; 
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Insert a city into the tree structure
  insert(word) {
    let current = this.root;
    const lowerWord = word.toLowerCase();
    
    for (let i = 0; i < lowerWord.length; i++) {
      let char = lowerWord[i];
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    current.isEndOfWord = true;
    current.fullName = word; // Store the correctly capitalized name at the leaf
  }

  // Traverse down the prefix, then collect all possible branches
  searchPrefix(prefix) {
    if (!prefix) return [];
    
    let current = this.root;
    const lowerPrefix = prefix.toLowerCase();
    
    for (let i = 0; i < lowerPrefix.length; i++) {
      let char = lowerPrefix[i];
      if (!current.children[char]) {
        return []; // The prefix doesn't exist in our data
      }
      current = current.children[char];
    }
    
    // We found the end of the prefix, now run DFS to get all autocomplete suggestions
    return this._collectAllWords(current);
  }

  // Depth-First Search (DFS) helper to gather all words under a node
  _collectAllWords(node) {
    let words = [];
    if (node.isEndOfWord) {
      words.push(node.fullName);
    }
    for (let char in node.children) {
      words = words.concat(this._collectAllWords(node.children[char]));
    }
    return words;
  }
}

// A sample dataset of major global cities to test our autocomplete
const cityDataset = [
  "Delhi, India", "Mumbai, India", "Bangalore, India", "Kolkata, India",
  "London, UK", "Liverpool, UK", "Los Angeles, USA", "Las Vegas, USA",
  "New York, USA", "Newark, USA", "Tokyo, Japan", "Toronto, Canada",
  "Sydney, Australia", "Shanghai, China", "Sao Paulo, Brazil"
];

// Instantiate and populate the global Trie instance
export const cityTrie = new Trie();
cityDataset.forEach(city => cityTrie.insert(city));
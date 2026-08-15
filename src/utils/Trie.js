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
    current.fullName = word; 
  }

  searchPrefix(prefix) {
    if (!prefix) return [];
    
    let current = this.root;
    const lowerPrefix = prefix.toLowerCase();
    
    for (let i = 0; i < lowerPrefix.length; i++) {
      let char = lowerPrefix[i];
      if (!current.children[char]) {
        return []; 
      }
      current = current.children[char];
    }
    
    return this._collectAllWords(current);
  }

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

// 🌍 MASSIVE GLOBAL CITY DATASET
const cityDataset = [
  // North America
  "New York, USA", "Los Angeles, USA", "Chicago, USA", "Houston, USA", "Phoenix, USA",
  "Philadelphia, USA", "San Antonio, USA", "San Diego, USA", "Dallas, USA", "San Jose, USA",
  "Austin, USA", "Jacksonville, USA", "Fort Worth, USA", "Columbus, USA", "San Francisco, USA",
  "Charlotte, USA", "Indianapolis, USA", "Seattle, USA", "Denver, USA", "Washington, USA",
  "Boston, USA", "Miami, USA", "Atlanta, USA", "Toronto, Canada", "Montreal, Canada",
  "Vancouver, Canada", "Calgary, Canada", "Edmonton, Canada", "Ottawa, Canada",
  "Mexico City, Mexico", "Guadalajara, Mexico", "Monterrey, Mexico", "Tijuana, Mexico",

  // South America
  "Sao Paulo, Brazil", "Rio de Janeiro, Brazil", "Brasilia, Brazil", "Salvador, Brazil",
  "Fortaleza, Brazil", "Belo Horizonte, Brazil", "Buenos Aires, Argentina", "Cordoba, Argentina",
  "Rosario, Argentina", "Bogota, Colombia", "Medellin, Colombia", "Cali, Colombia",
  "Lima, Peru", "Arequipa, Peru", "Santiago, Chile", "Caracas, Venezuela", "Quito, Ecuador",

  // Europe
  "London, UK", "Birmingham, UK", "Manchester, UK", "Glasgow, UK", "Liverpool, UK",
  "Paris, France", "Marseille, France", "Lyon, France", "Toulouse, France",
  "Berlin, Germany", "Hamburg, Germany", "Munich, Germany", "Cologne, Germany", "Frankfurt, Germany",
  "Madrid, Spain", "Barcelona, Spain", "Valencia, Spain", "Seville, Spain",
  "Rome, Italy", "Milan, Italy", "Naples, Italy", "Turin, Italy", "Palermo, Italy",
  "Moscow, Russia", "Saint Petersburg, Russia", "Novosibirsk, Russia", "Yekaterinburg, Russia",
  "Kyiv, Ukraine", "Warsaw, Poland", "Bucharest, Romania", "Budapest, Hungary",
  "Vienna, Austria", "Prague, Czechia", "Stockholm, Sweden", "Amsterdam, Netherlands",
  "Athens, Greece", "Lisbon, Portugal", "Dublin, Ireland", "Brussels, Belgium",

  // Asia
  "Tokyo, Japan", "Yokohama, Japan", "Osaka, Japan", "Nagoya, Japan", "Sapporo, Japan",
  "Seoul, South Korea", "Busan, South Korea", "Incheon, South Korea",
  "Beijing, China", "Shanghai, China", "Guangzhou, China", "Shenzhen, China", "Chengdu, China",
  "Delhi, India", "Mumbai, India", "Bangalore, India", "Hyderabad, India", "Ahmedabad, India",
  "Chennai, India", "Kolkata, India", "Surat, India", "Pune, India", "Jaipur, India",
  "Jakarta, Indonesia", "Surabaya, Indonesia", "Bandung, Indonesia",
  "Manila, Philippines", "Quezon City, Philippines", "Davao, Philippines",
  "Bangkok, Thailand", "Ho Chi Minh City, Vietnam", "Hanoi, Vietnam",
  "Kuala Lumpur, Malaysia", "Singapore, Singapore", "Dhaka, Bangladesh", "Karachi, Pakistan",
  "Lahore, Pakistan", "Islamabad, Pakistan", "Tehran, Iran", "Baghdad, Iraq",
  "Riyadh, Saudi Arabia", "Jeddah, Saudi Arabia", "Dubai, UAE", "Abu Dhabi, UAE", "Tel Aviv, Israel",

  // Africa
  "Lagos, Nigeria", "Kano, Nigeria", "Ibadan, Nigeria",
  "Cairo, Egypt", "Alexandria, Egypt", "Giza, Egypt",
  "Kinshasa, DR Congo", "Johannesburg, South Africa", "Cape Town, South Africa", "Durban, South Africa",
  "Nairobi, Kenya", "Addis Ababa, Ethiopia", "Casablanca, Morocco", "Algiers, Algeria",
  "Luanda, Angola", "Dar es Salaam, Tanzania", "Dakar, Senegal", "Accra, Ghana",

  // Oceania
  "Sydney, Australia", "Melbourne, Australia", "Brisbane, Australia", "Perth, Australia",
  "Adelaide, Australia", "Auckland, New Zealand", "Wellington, New Zealand", "Christchurch, New Zealand",
  "Honolulu, USA", "Suva, Fiji", "Port Moresby, Papua New Guinea"
];

// Instantiate and populate the global Trie instance
export const cityTrie = new Trie();
cityDataset.forEach(city => cityTrie.insert(city));
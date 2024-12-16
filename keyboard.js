class TrieNode {
    constructor() {
      this.children = {};
      this.characters = [];
    }
  }
  
  class Trie {
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(code, characters) {
      let node = this.root;
      for (let char of code) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.characters = node.characters.concat(characters);
    }
  
    search(input, maxResults = 10) {
      const results = new Set();
  
      // Step 1: Exact match
      this.collectExactMatches(input, results, maxResults);
  
      // Step 2: Prefix match
      if (results.size < maxResults) {
        this.collectPrefixMatches(input, results, maxResults);
      }
  
      // Step 3: Suffix match
      if (results.size < maxResults) {
        this.collectSuffixMatches(input, results, maxResults);
      }
  
      return Array.from(results).slice(0, maxResults); // Convert Set to Array and ensure no more than maxResults
    }
    
  
    collectExactMatches(code, results, maxResults) {
      let node = this.root;
      for (let char of code) {
        if (!node.children[char]) return; // No exact match found
        node = node.children[char];
      }
      // Add characters if there are any
      if (node.characters.length > 0) {
        node.characters.forEach((char) => results.add(char));
      }
    }
  
    collectPrefixMatches(prefix, results, maxResults) {
      let node = this.root;
      for (let char of prefix) {
        if (!node.children[char]) return; // No prefix match
        node = node.children[char];
      }
      // Collect all characters starting from this node
      this.collectCharacters(node, results, maxResults);
    }
  
    collectSuffixMatches(suffix, results, maxResults) {
      this.searchForSuffix(this.root, suffix, '', results, maxResults);
    }
  
    searchForSuffix(node, suffix, currentCode, results, maxResults) {
      if (currentCode.endsWith(suffix) && node.characters.length > 0) {
        node.characters.forEach((char) => results.add(char));
        if (results.length >= maxResults) return;
      }
  
      for (let [char, childNode] of Object.entries(node.children)) {
        this.searchForSuffix(childNode, suffix, currentCode + char, results, maxResults);
        if (results.length >= maxResults) return;
      }
    }
  
    collectCharacters(node, results, maxResults) {
      if (node.characters.length > 0) {
        node.characters.forEach((char) => results.add(char));
        if (results.length >= maxResults) {
          return;
        }
      }
      for (let childNode of Object.values(node.children)) {
        this.collectCharacters(childNode, results, maxResults);
        if (results.length >= maxResults) return;
      }
    }
  }
  
  
  
      const characterTrie = new Trie();
      
      for (const [code, characters] of Object.entries(characterDict)) {
        characterTrie.insert(code, characters);
      }
      console.log(characterTrie);
  
  
      let currentCode = '';
      let candidateList = [];
      const keyboardLayout1 = 'QWERTYUIOP';
      const keyboardLayout2 = 'ASDFGHJKL';
      const keyboardLayout3 = 'ZXCVBNM';
      const codediv = document.querySelector(".currentCode");
      const keyboardContainer = document.getElementById('keyboard');
      const candidateBox = document.getElementById('candidateBox');
      const candidateText = document.getElementById('candidateText');
      const inputArea = document.getElementById('inputArea');
  
  
      const l1 = document.createElement('div');
      l1.classList.add('key1');
      keyboardContainer.appendChild(l1);
      keyboardLayout1.split('').forEach(char => {
        const keyElement = document.createElement('span');
        keyElement.classList.add('key');
        keyElement.textContent = char;
        keyElement.id = `key-${char}`;
        l1.appendChild(keyElement);
      });
  
      const l2 = document.createElement('div');
      l2.classList.add('key2');
      keyboardContainer.appendChild(l2);
      keyboardLayout2.split('').forEach(char => {
        const keyElement = document.createElement('span');
        keyElement.classList.add('key');
        keyElement.textContent = char;
        keyElement.id = `key-${char}`;
        l2.appendChild(keyElement);
      });
  
      const l3 = document.createElement('div');
      l3.classList.add('key3');
      keyboardContainer.appendChild(l3);
      keyboardLayout3.split('').forEach(char => {
        const keyElement = document.createElement('span');
        keyElement.classList.add('key');
        keyElement.textContent = char;
        keyElement.id = `key-${char}`;
        l3.appendChild(keyElement);
      });
  
  
      document.addEventListener('keydown', (event) => {
        const keyChar = event.key.toUpperCase();
        const keyElement = document.getElementById(`key-${keyChar}`);
  
        if (keyChar.match("BACKSPACE")) {
          currentCode = currentCode.slice(0, -1);
          codediv.textContent = currentCode;
          updateCandidateBox();
        } else if (keyChar.match(/[0-9]/) && keyChar.length == 1) {
          selectCharacterFromCandidateBox((parseInt(keyChar) - 1));
          event.preventDefault();
        } else if (keyChar.match(/[A-Z]/) && keyChar.length == 1) {
          currentCode += keyChar;
          codediv.textContent = currentCode;
          updateCandidateBox();
        } else if (event.key === ' ') {
          selectCharacterFromCandidateBox(0);
          event.preventDefault();

          currentCode = "";
          candidateList = [];
        }
  
        if (keyElement) {
          keyElement.classList.add('active');
        }
      });
  
  
      document.addEventListener('keyup', (event) => {
        const keyChar = event.key.toUpperCase();
        const keyElement = document.getElementById(`key-${keyChar}`);
        if (keyElement) {
          keyElement.classList.remove('active');
        }
      });
  
  
      function updateCandidateBox() {
        if (currentCode.trim().length == 0) {
          candidateText.innerHTML = '';
          return;
        }
  
        candidateList = characterTrie.search(currentCode);
  
        console.log(currentCode, candidateList.join(' '));
        const newarr = candidateList.map(v => {
          return `<span>${v}</span>`;
        });
        console.log(newarr);
  
        candidateText.innerHTML = newarr.join('');
        if (candidateList.length > 0) {
          //
        } else {
          candidateText.innerHTML = '';
        }
      }
  
  
      function selectCharacterFromCandidateBox(ind) {
        if (candidateList.length > 0 && candidateList.length >= (ind + 1)) {
          inputArea.value += candidateList[ind];
          currentCode = '';
          codediv.textContent = currentCode;
          updateCandidateBox();
        }
      }
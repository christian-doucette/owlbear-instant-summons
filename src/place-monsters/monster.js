export default class Monster {    
  constructor(name, source, size) {
    this.name = name;
    this.source = source;
    this.size = size;
  }

  #sanitizedName() {
    return this.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  imageUrl() {
    return `https://5e.tools/img/bestiary/tokens/${this.source}/${this.#sanitizedName()}.webp`;
  }

  #pixelSize() {
    return {
      'T': 280,
      'S': 280,
      'M': 280,
      'L': 560,
      'H': 560,
      'G': 560
    }[this.size];
  }

  #numSquares() {
    return {
      'T': 1,
      'S': 1,
      'M': 1,
      'L': 2,
      'H': 3,
      'G': 4
    }[this.size];  
  }

  dpi() {
    return this.#pixelSize() / this.#numSquares();
  }

  evenNumSquares() {
    return this.#numSquares() % 2 == 0;
  }

  offset() {
    return {
      x: this.#pixelSize() / 2.0,
      y: this.#pixelSize() / 2.0
    };
  }

  height() {
    return this.#pixelSize();
  }

  width() {
    return this.#pixelSize();
  }    
}
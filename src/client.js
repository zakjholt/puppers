// Api client
export class DogCeoClient {
  constructor() {
    this._baseUrl = "https://dog.ceo/api";
    this._get = this._get.bind(this);
    this.getBreedOptions = this.getBreedOptions.bind(this);
    this.getRandomBreedImageUrl = this.getRandomBreedImageUrl.bind(this);
  }

  _get(url) {
    return fetch(`${this._baseUrl}${url}`);
  }

  async getBreedOptions() {
    const breedResponse = await this._get("/breeds/list/all");
    const breedData = await breedResponse.json();
    return Object.keys(breedData.message).map((n) => ({ label: n, value: n }));
  }

  async getRandomBreedImageUrl(breedName) {
    const response = await this._get(`/breed/${breedName}/images/random`);
    const data = await response.json();

    return data.message;
  }
}

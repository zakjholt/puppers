// Api client
export class DogCeoClient {
  _baseUrl = "https://dog.ceo/api";

  _get = (url) => fetch(`${this._baseUrl}${url}`);

  getBreedOptions = async () => {
    const breedResponse = await this._get("/breeds/list/all");
    const breedData = await breedResponse.json();
    return Object.keys(breedData.message).map((n) => ({ label: n, value: n }));
  };

  getRandomBreedImageUrl = async (breedName) => {
    const response = await this._get(`/breed/${breedName}/images/random`);
    const data = await response.json();

    return data.message;
  };
}

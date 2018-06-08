export class MemoryCache<T> {
  private _memoryObject: { [key: string]: { value: T, invalidateTimestamp: number}; } = {};

  public get(key: string): T {
    const cachedObject = this._memoryObject[key];
    if (cachedObject.invalidateTimestamp <= Date.now()) {
      delete this._memoryObject[key];
      return undefined;
    }
    return cachedObject.value;
  }

  public set(key: string, value: T, invalidateTimestamp: number) {
    if (invalidateTimestamp > Date.now()) {
      this._memoryObject[key].value = value;
    }
  }

  public flush() {
    this._memoryObject = {};
  }
}

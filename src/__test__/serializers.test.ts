import { Serializer, Serializers } from '../serializer';

const mediaType = 'application/json';
const serializer: Serializer = () => '';

describe('Serializers', () => {
  it('should be subclass of Map', () => {
    expect(new Serializers()).toBeInstanceOf(Map);
  });

  describe('constructor', () => {
    it('should initialize from array of pairs', () => {
      const pairs: [string, Serializer][] = [
        [mediaType, serializer],
        ['application/xml', serializer]
      ];
  
      const serializers = new Serializers(pairs);

      expect([...serializers.entries()]).toEqual(pairs);
    });

    it('should initialize from record', () => {
      const record: Record<string, Serializer> = {
        [mediaType]: serializer,
        'application/xml': serializer
      };

      const serializers = new Serializers(record);

      expect([...serializers.entries()]).toEqual(Object.entries(record));
    });

    it('should initialize from Serializers', () => {
      const init = new Serializers({
        [mediaType]: serializer,
        'application/xml': serializer
      });

      const serializers = new Serializers(init);

      expect([...serializers.entries()]).toEqual([...init.entries()]);
    });
  });

  describe('set()', () => {
    const serializers = new Serializers();

    it('should allow valid key-value pair', () => {
      expect(() => serializers.set(mediaType, serializer)).not.toThrow();
    });

    it('should error if key is not a valid media type', () => {
      expect(() => serializers.set('invalid-media-type', serializer)).toThrow();
    });

    it('should error if value is not a function', () => {
      expect(() => serializers.set(mediaType, <any>undefined)).toThrow();
      expect(() => serializers.set(mediaType, <any>null)).toThrow();
      expect(() => serializers.set(mediaType, <any>true)).toThrow();
      expect(() => serializers.set(mediaType, <any>42)).toThrow();
      expect(() => serializers.set(mediaType, <any>'foo')).toThrow();
      expect(() => serializers.set(mediaType, <any>[])).toThrow();
      expect(() => serializers.set(mediaType, <any>{})).toThrow();
    });
  });
});

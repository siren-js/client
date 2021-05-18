/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from '@siren-js/core';
import { toEntryList } from '../entry';

describe('constructing the entry list', () => {
  it('should return empty list when fields is not an array', () => {
    [undefined, null, true, 42, 'foo', {}].forEach((value: any) => {
      expect(toEntryList({ fields: value })).toEqual([]);
    });
  });

  it('should convert fields to entry list', () => {
    const action = new Action('create-account', '/kitchen-sink', {
      fields: [
        { name: 'source', type: 'hidden', value: 'mobile' },
        { name: 'fullName', type: 'text', value: 'Harry Potter' },
        { name: 'quest', type: 'search', value: 'destroy the horcruxes' },
        { name: 'phone', type: 'tel', value: '+44 7700 900077' },
        {
          name: 'website',
          type: 'url',
          value: 'https://harrypotter.fandom.com/wiki/Harry_Potter'
        },
        { name: 'email', type: 'email', value: 'harry@potter.uk' },
        { name: 'password', type: 'password', value: 'v0ldemort$tinks' },
        { name: 'birthDate', type: 'date', value: '1980-07-31' },
        { name: 'birthMonth', type: 'week', value: '1980-07' },
        { name: 'birthWeek', type: 'week', value: '1980-W31' },
        { name: 'birthTime', type: 'time', value: '12:34:56.789' },
        {
          name: 'birthDateTime',
          type: 'datetime-local',
          value: '1980-07-31T12:34:56.789'
        },
        { name: 'favoriteNumber', type: 'number', value: 42 },
        { name: 'randomNumber', type: 'range', value: 69 },
        { name: 'favoriteColor', type: 'color', value: '#740001' },
        { name: 'wizard', type: 'checkbox', value: 'yes', checked: true },
        {
          name: 'hogwartsHouse',
          type: 'radio',
          group: [
            { title: 'Gryffindor', value: 'gryffindor', checked: true },
            { title: 'Hufflepuff', value: 'hufflepuff' },
            { title: 'Ravenclaw', value: 'ravenclaw' },
            { title: 'Slytherin', value: 'slytherin' }
          ]
        }
      ]
    });

    const entryList = toEntryList(action);

    const expected = [
      ['source', 'mobile'],
      ['fullName', 'Harry Potter'],
      ['quest', 'destroy the horcruxes'],
      ['phone', '+44 7700 900077'],
      ['website', 'https://harrypotter.fandom.com/wiki/Harry_Potter'],
      ['email', 'harry@potter.uk'],
      ['password', 'v0ldemort$tinks'],
      ['birthDate', '1980-07-31'],
      ['birthMonth', '1980-07'],
      ['birthWeek', '1980-W31'],
      ['birthTime', '12:34:56.789'],
      ['birthDateTime', '1980-07-31T12:34:56.789'],
      ['favoriteNumber', '42'],
      ['randomNumber', '69'],
      ['favoriteColor', '#740001'],
      ['wizard', 'yes'],
      ['hogwartsHouse', 'gryffindor']
    ];

    expect(entryList).toHaveLength(expected.length);
    expected.forEach(([name, value], index) => {
      expect(entryList[index].name).toBe(name);
      expect(entryList[index].value).toBe(value);
    });
  });

  it('should default value to empty string', () => {
    const action = new Action('create-account', '/kitchen-sink', {
      fields: [
        { name: 'source', type: 'hidden' },
        { name: 'fullName', type: 'text' },
        { name: 'quest', type: 'search' },
        { name: 'phone', type: 'tel' },
        { name: 'website', type: 'url' },
        { name: 'email', type: 'email' },
        { name: 'password', type: 'password' },
        { name: 'birthDate', type: 'date' },
        { name: 'birthMonth', type: 'week' },
        { name: 'birthWeek', type: 'week' },
        { name: 'birthTime', type: 'time' },
        { name: 'birthDateTime', type: 'datetime-local' },
        { name: 'favoriteNumber', type: 'number' },
        { name: 'randomNumber', type: 'range' },
        { name: 'favoriteColor', type: 'color' }
      ]
    });

    const entryList = toEntryList(action);

    const expected = [
      ['source', ''],
      ['fullName', ''],
      ['quest', ''],
      ['phone', ''],
      ['website', ''],
      ['email', ''],
      ['password', ''],
      ['birthDate', ''],
      ['birthMonth', ''],
      ['birthWeek', ''],
      ['birthTime', ''],
      ['birthDateTime', ''],
      ['favoriteNumber', ''],
      ['randomNumber', ''],
      ['favoriteColor', '']
    ];

    expect(entryList).toHaveLength(expected.length);
    expected.forEach(([name, value], index) => {
      expect(entryList[index].name).toBe(name);
      expect(entryList[index].value).toBe(value);
    });
  });

  it('should ignore skippable fields', () => {
    const action = {
      fields: [
        { value: 'foo' },
        { name: '', value: 'foo' },
        { name: 'foo', disabled: true },
        { name: 'bar', type: 'image' }
      ]
    };

    const entryList = toEntryList(<any>action);

    expect(entryList).toEqual([]);
  });

  it('should default checkbox and radio button value to on', () => {
    const action = new Action('foo', '/foo', {
      fields: [
        { name: 'foo', type: 'checkbox', checked: true },
        { name: 'bar', type: 'radio', group: [{ checked: true }] }
      ]
    });

    const entryList = toEntryList(action);

    expect(entryList).toHaveLength(2);
    expect(entryList[0].value).toBe('on');
    expect(entryList[1].value).toBe('on');
  });

  it('should not add entry for unchecked checkboxes and radio buttons', () => {
    const action = new Action('foo', '/foo', {
      fields: [
        { name: 'foo', type: 'checkbox' },
        {
          name: 'bar',
          type: 'radio',
          group: [
            { title: 'baz', value: 1 },
            { title: 'qux', value: 2 }
          ]
        }
      ]
    });

    const entryList = toEntryList(action);

    expect(entryList).toEqual([]);
  });

  it('should include first checked radio button', () => {
    const action = new Action('foo', '/foo', {
      fields: [
        {
          name: 'foo',
          type: 'radio',
          group: [
            { title: 'bar', value: 1, checked: true },
            { title: 'baz', value: 2, checked: true }
          ]
        }
      ]
    });

    const entryList = toEntryList(action);

    expect(entryList).toHaveLength(1);
    expect(entryList[0].value).toBe('1');
  });

  it('should ignore radio button with invalid or missing group', () => {
    const action = new Action('foo', '/foo', {
      fields: [
        { name: 'foo', type: 'radio' },
        { name: 'bar', type: 'radio', group: { foo: 'bar' } }
      ]
    });

    const entryList = toEntryList(action);

    expect(entryList).toEqual([]);
  });
});

import { mock } from 'jest-mock-extended';

import { DefaultSirenElementVisitor, SirenElementVisitor } from '../visitor';
import { crawl } from './crawl';
import { Crawler } from './crawler';
import { DefaultPolitenessPolicy, PolitenessPolicy } from './politeness-policy';
import { defaultRevisitPolicy, RevisitPolicy } from './revisit-policy';
import { DefaultSelectionPolicy, SelectionPolicy } from './selection-policy';

const mockCrawl = jest.fn();

jest.mock('../visitor');
jest.mock('./politeness-policy');
jest.mock('./revisit-policy');
jest.mock('./selection-policy');
jest.mock('./crawler', () => ({
  Crawler: jest.fn(() => ({
    crawl: mockCrawl
  }))
}));

describe('crawl', () => {
  const MockCrawler = jest.mocked(Crawler);
  const MockDefaultPolitenessPolicy = jest.mocked(DefaultPolitenessPolicy);
  const MockDefaultSelectionPolicy = jest.mocked(DefaultSelectionPolicy);
  const MockDefaultSirenElementVisitor = jest.mocked(DefaultSirenElementVisitor);
  const entryPoint = 'http://example.io';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    expect(mockCrawl).toHaveBeenCalledTimes(1);
    expect(mockCrawl).toHaveBeenCalledWith(entryPoint);
  });

  it('should create and delegate to a Crawler with default policies and visitor', async () => {
    await crawl(entryPoint);

    expect(MockDefaultPolitenessPolicy).toHaveBeenCalledTimes(1);
    expect(MockDefaultSelectionPolicy).toHaveBeenCalledTimes(1);
    expect(MockDefaultSirenElementVisitor).toHaveBeenCalledTimes(1);
    expect(MockCrawler).toHaveBeenCalledTimes(1);
    expect(MockCrawler).toHaveBeenCalledWith(
      MockDefaultPolitenessPolicy.mock.instances[0],
      defaultRevisitPolicy,
      MockDefaultSelectionPolicy.mock.instances[0],
      MockDefaultSirenElementVisitor.mock.instances[0]
    );
  });

  it('should use politeness policy when provided', async () => {
    const politenessPolicy = mock<PolitenessPolicy>();

    await crawl(entryPoint, { politenessPolicy });

    expect(MockDefaultPolitenessPolicy).not.toHaveBeenCalled();
    expect(MockCrawler).toHaveBeenCalledTimes(1);
    expect(MockCrawler.mock.calls[0][0]).toBe(politenessPolicy);
  });

  it('should use re-visit policy when provided', async () => {
    const revisitPolicy = mock<RevisitPolicy>();

    await crawl(entryPoint, { revisitPolicy });

    expect(MockCrawler).toHaveBeenCalledTimes(1);
    expect(MockCrawler.mock.calls[0][1]).toBe(revisitPolicy);
  });

  it('should use selection policy when provided', async () => {
    const selectionPolicy = mock<SelectionPolicy>();

    await crawl(entryPoint, { selectionPolicy });

    expect(MockDefaultSelectionPolicy).not.toHaveBeenCalled();
    expect(MockCrawler).toHaveBeenCalledTimes(1);
    expect(MockCrawler.mock.calls[0][2]).toBe(selectionPolicy);
  });

  it('should use visitor when provided', async () => {
    const visitor = mock<SirenElementVisitor>();

    await crawl(entryPoint, { visitor });

    expect(MockDefaultSirenElementVisitor).not.toHaveBeenCalled();
    expect(MockCrawler).toHaveBeenCalledTimes(1);
    expect(MockCrawler.mock.calls[0][3]).toBe(visitor);
  });
});

import { mock, mockReset } from 'jest-mock-extended';
import nock from 'nock';

import * as stubs from '../../test/stubs';
import { Link } from '../models';
import { SirenElementVisitor } from '../visitor';
import { Crawler } from './crawler';
import { PolitenessPolicy } from './politeness-policy';
import { RevisitPolicy } from './revisit-policy';
import { SelectionPolicy } from './selection-policy';

describe('Crawler', () => {
  let crawler: Crawler;
  const politenessPolicy = mock<PolitenessPolicy>({ delay: 0 });
  const revisitPolicy = mock<RevisitPolicy>();
  const selectionPolicy = mock<SelectionPolicy>();
  const visitor = mock<SirenElementVisitor>();

  beforeEach(() => {
    crawler = new Crawler(politenessPolicy, revisitPolicy, selectionPolicy, visitor);

    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    nock.restore();
    mockReset(visitor);
    mockReset(selectionPolicy);
    mockReset(revisitPolicy);
    mockReset(politenessPolicy);
  });

  describe('crawl', () => {
    const entryPoint = stubs.selfLink.href;
    const mediaType = 'application/vnd.siren+json';
    const replyHeaders = { 'Content-Type': mediaType };

    const pathOf = (link: Link) => new URL(link.href).pathname;

    it('should crawl leaf entity', async () => {
      politenessPolicy.canCrawl.mockReturnValue(true);
      revisitPolicy.canRevisit.mockReturnValue(false);
      selectionPolicy.selectFrom.mockResolvedValue([]);
      nock(stubs.baseUrl).get(pathOf(stubs.selfLink)).reply(200, stubs.entity, replyHeaders);

      await crawler.crawl(entryPoint);

      expect(politenessPolicy.canCrawl).toHaveBeenCalledTimes(1);
      expect(politenessPolicy.canCrawl).toHaveBeenCalledWith(entryPoint);
      expect(revisitPolicy.canRevisit).not.toHaveBeenCalled();
      expect(selectionPolicy.selectFrom).toHaveBeenCalledTimes(1);
      expect(selectionPolicy.selectFrom).toHaveBeenCalledWith(stubs.entity);
      expect(visitor.visitEntity).toHaveBeenCalled();
    });

    it('should crawl targets returned from selection policy', async () => {
      politenessPolicy.canCrawl.mockReturnValue(true);
      revisitPolicy.canRevisit.mockReturnValue(false);
      selectionPolicy.selectFrom.mockResolvedValueOnce([stubs.upLink, stubs.knowsLink]).mockResolvedValue([]);
      nock(stubs.baseUrl)
        .get(pathOf(stubs.selfLink))
        .reply(200, stubs.entity, replyHeaders)
        .get(pathOf(stubs.upLink))
        .reply(200, stubs.entity, replyHeaders)
        .get(pathOf(stubs.knowsLink))
        .reply(200, stubs.entity, replyHeaders);

      await crawler.crawl(entryPoint);

      expect(politenessPolicy.canCrawl).toHaveBeenCalledTimes(3);
      expect(politenessPolicy.canCrawl).toHaveBeenNthCalledWith(1, entryPoint);
      expect(politenessPolicy.canCrawl).toHaveBeenNthCalledWith(2, stubs.upLink);
      expect(politenessPolicy.canCrawl).toHaveBeenNthCalledWith(3, stubs.knowsLink);
      expect(revisitPolicy.canRevisit).not.toHaveBeenCalled();
      expect(selectionPolicy.selectFrom).toHaveBeenCalledTimes(3);
      expect(selectionPolicy.selectFrom).toHaveBeenNthCalledWith(1, stubs.entity);
      expect(selectionPolicy.selectFrom).toHaveBeenNthCalledWith(2, stubs.entity);
      expect(selectionPolicy.selectFrom).toHaveBeenNthCalledWith(3, stubs.entity);
      expect(visitor.visitEntity).toHaveBeenCalled();
    });

    it('should crawl the entity graph', async () => {
      politenessPolicy.canCrawl.mockReturnValue(true);
      revisitPolicy.canRevisit.mockReturnValue(false);
      selectionPolicy.selectFrom
        .mockResolvedValueOnce([stubs.upLink])
        .mockResolvedValueOnce([stubs.knowsLink])
        .mockResolvedValue([]);
      nock(stubs.baseUrl)
        .get(pathOf(stubs.selfLink))
        .reply(200, stubs.entity, replyHeaders)
        .get(pathOf(stubs.upLink))
        .reply(200, stubs.entity, replyHeaders)
        .get(pathOf(stubs.knowsLink))
        .reply(200, stubs.entity, replyHeaders);

      await crawler.crawl(entryPoint);

      expect(politenessPolicy.canCrawl).toHaveBeenCalledTimes(3);
      expect(politenessPolicy.canCrawl).toHaveBeenNthCalledWith(1, entryPoint);
      expect(politenessPolicy.canCrawl).toHaveBeenNthCalledWith(2, stubs.upLink);
      expect(politenessPolicy.canCrawl).toHaveBeenNthCalledWith(3, stubs.knowsLink);
      expect(revisitPolicy.canRevisit).not.toHaveBeenCalled();
      expect(selectionPolicy.selectFrom).toHaveBeenCalledTimes(3);
      expect(selectionPolicy.selectFrom).toHaveBeenNthCalledWith(1, stubs.entity);
      expect(selectionPolicy.selectFrom).toHaveBeenNthCalledWith(2, stubs.entity);
      expect(selectionPolicy.selectFrom).toHaveBeenNthCalledWith(3, stubs.entity);
      expect(visitor.visitEntity).toHaveBeenCalled();
    });

    it('should only crawl targets allowed by the politeness policy', async () => {
      politenessPolicy.canCrawl.mockReturnValue(false).mockReturnValueOnce(true);
      revisitPolicy.canRevisit.mockReturnValue(false);
      selectionPolicy.selectFrom.mockResolvedValueOnce([stubs.upLink]).mockResolvedValue([]);
      nock(stubs.baseUrl)
        .get(pathOf(stubs.selfLink))
        .reply(200, stubs.entity, replyHeaders)
        .get(pathOf(stubs.upLink))
        .reply(200, stubs.entity, replyHeaders);

      await crawler.crawl(entryPoint);

      expect(politenessPolicy.canCrawl).toHaveBeenCalledTimes(2);
      expect(politenessPolicy.canCrawl).toHaveBeenNthCalledWith(1, entryPoint);
      expect(politenessPolicy.canCrawl).toHaveBeenNthCalledWith(2, stubs.upLink);
      expect(revisitPolicy.canRevisit).not.toHaveBeenCalled();
      expect(selectionPolicy.selectFrom).toHaveBeenCalledTimes(1);
      expect(selectionPolicy.selectFrom).toHaveBeenCalledWith(stubs.entity);
      expect(visitor.visitEntity).toHaveBeenCalled();
    });

    it('should only crawl targets again when allowed by the revisit policy', async () => {
      politenessPolicy.canCrawl.mockReturnValue(true);
      revisitPolicy.canRevisit.mockReturnValueOnce(true).mockReturnValue(false);
      selectionPolicy.selectFrom.mockResolvedValueOnce([stubs.selfLink, stubs.selfLink]).mockResolvedValue([]);
      nock(stubs.baseUrl)
        .get(pathOf(stubs.selfLink))
        .reply(200, stubs.entity, replyHeaders)
        .get(pathOf(stubs.selfLink))
        .reply(200, stubs.entity, replyHeaders);

      await crawler.crawl(entryPoint);

      expect(politenessPolicy.canCrawl).toHaveBeenCalledTimes(3);
      expect(politenessPolicy.canCrawl).toHaveBeenNthCalledWith(1, entryPoint);
      expect(politenessPolicy.canCrawl).toHaveBeenNthCalledWith(2, stubs.selfLink);
      expect(politenessPolicy.canCrawl).toHaveBeenNthCalledWith(3, stubs.selfLink);
      expect(revisitPolicy.canRevisit).toHaveBeenCalledTimes(2);
      expect(revisitPolicy.canRevisit).toHaveBeenNthCalledWith(1, stubs.selfLink);
      expect(revisitPolicy.canRevisit).toHaveBeenNthCalledWith(2, stubs.selfLink);
      expect(selectionPolicy.selectFrom).toHaveBeenCalledTimes(2);
      expect(selectionPolicy.selectFrom).toHaveBeenNthCalledWith(1, stubs.entity);
      expect(selectionPolicy.selectFrom).toHaveBeenNthCalledWith(2, stubs.entity);
      expect(visitor.visitEntity).toHaveBeenCalled();
    });

    it('should wait between requests as defined by the politeness policy', async () => {
      jest.spyOn(global, 'setTimeout');
      const delay = 1000;
      politenessPolicy.delay = delay;
      politenessPolicy.canCrawl.mockReturnValue(true);
      revisitPolicy.canRevisit.mockReturnValue(false);
      selectionPolicy.selectFrom.mockResolvedValue([]);
      nock(stubs.baseUrl).get(pathOf(stubs.selfLink)).reply(200, stubs.entity, replyHeaders);

      await crawler.crawl(entryPoint);

      expect(politenessPolicy.canCrawl).toHaveBeenCalledTimes(1);
      expect(politenessPolicy.canCrawl).toHaveBeenCalledWith(entryPoint);
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), delay);
      expect(revisitPolicy.canRevisit).not.toHaveBeenCalled();
      expect(selectionPolicy.selectFrom).toHaveBeenCalledTimes(1);
      expect(selectionPolicy.selectFrom).toHaveBeenCalledWith(stubs.entity);
      expect(visitor.visitEntity).toHaveBeenCalled();
    });

    it('should gracefully handle a non-Siren resource', async () => {
      politenessPolicy.canCrawl.mockReturnValue(true);
      revisitPolicy.canRevisit.mockReturnValue(false);
      selectionPolicy.selectFrom.mockResolvedValue([]);
      nock(stubs.baseUrl).get(pathOf(stubs.selfLink)).reply(200, 'Lorem ipsum', { 'Content-Type': 'text/plain' });

      await crawler.crawl(entryPoint);

      expect(politenessPolicy.canCrawl).toHaveBeenCalledTimes(1);
      expect(politenessPolicy.canCrawl).toHaveBeenCalledWith(entryPoint);
      expect(revisitPolicy.canRevisit).not.toHaveBeenCalled();
      expect(selectionPolicy.selectFrom).not.toHaveBeenCalled();
      expect(visitor.visitEntity).not.toHaveBeenCalled();
    });
  });
});

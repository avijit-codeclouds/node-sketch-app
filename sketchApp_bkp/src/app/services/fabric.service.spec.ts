import { TestBed } from '@angular/core/testing';

import { FabricService } from './fabric.service';

describe('FabricService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FabricService = TestBed.get(FabricService);
    expect(service).toBeTruthy();
  });
});

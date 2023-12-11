import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import { PrismaService } from './prisma.service'



jest.mock('./client', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
    mockReset(prismaMock)
})

export const prismaMock = PrismaService as unknown as DeepMockProxy<PrismaClient>
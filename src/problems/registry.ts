import type { ProblemConfig } from './types'
import { p021 } from './p021-merge-two-sorted-lists'
import { p141 } from './p141-linked-list-cycle'
import { p160 } from './p160-intersection'
import { p206 } from './p206-reverse-list'
import { p234 } from './p234-palindrome-list'
import { p283 } from './p283-move-zeroes'

export const problemMap: Record<string, ProblemConfig> = {
  '21': p021,
  '141': p141,
  '160': p160,
  '206': p206,
  '234': p234,
  '283': p283,
}

export const problemList = Object.values(problemMap)

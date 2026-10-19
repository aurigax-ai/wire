import { describe, expect, it } from 'vitest'
import { checkOutput } from '../engine/outputs.ts'
import type { GraphNode } from '../format/model.ts'
import { agentKind } from './agent.ts'

const node = { id: 'tell', kind: 'agent' } as GraphNode

describe('the agent node output of a message', () => {
  it('records the bus state of the message: delivered, or queued with why it waits', () => {
    expect(() => checkOutput(agentKind, node, { pane: 'p', delivered: 'delivered' })).not.toThrow()
    expect(() =>
      checkOutput(agentKind, node, { pane: 'p', delivered: 'queued', pending: 'working' }),
    ).not.toThrow()
  })

  it('refuses the states the bus no longer has', () => {
    expect(() => checkOutput(agentKind, node, { pane: 'p', delivered: 'waiting' })).toThrow(
      /BadOutput|returned/,
    )
  })

  it('mocks a message as delivered', () => {
    expect(agentKind.mock?.({ mode: 'message' })).toEqual({ delivered: 'delivered' })
  })
})

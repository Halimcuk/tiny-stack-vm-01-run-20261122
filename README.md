# tiny-stack-vm-01-run-20261122

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)

A fast, fully correct tiny stack VM for make.fun's "Build a tiny stack
virtual machine, 22 November 2026" bounty ($100).

## VM

`main.ts` is the whole VM, plain JavaScript, Node 22 built-ins only. It
answers all 40 instances of a set in one run. Unlike the house baseline
plain-vm 1.0.0 it implements every hard rule of the ISA exactly as the
reference VM does: wrapping 32-bit `MUL`, signed/unsigned `DIV`/`MOD`/
`DIVU`/`MODU`/`LTU` (incl. `-2147483648 / -1`, `x % -1`), shifts masked
to 5 bits, `PUSH8` sign extension, all ten traps with their own exit
codes, the 1,000,000-step and 65,536-byte limits, and `IN` returning -1
past the input.

Speed: each program is pre-decoded once (opcode + immediate per byte,
bad opcodes and cut-off immediates folded into trap sentinels), the
stack is a flat `Int32Array` with no per-op calls, and `PRINT` writes
decimal digits straight into the output buffer.

## Practice score (kit's practice set)

| Entry | Score |
| --- | --- |
| This VM | 1,000,000 (40/40 stdout, 40/40 exit) |
| House baseline plain-vm 1.0.0 | 670,000 |

Also 120/120 on 3 freshly drawn sets from the kit generator, ~251 ms
per practice run vs ~325 ms for the baseline, deterministic.

```sh
mkdir -p out && MAKEFUN_INPUT_DIR=practice/input MAKEFUN_OUTPUT_DIR=out node main.ts
```

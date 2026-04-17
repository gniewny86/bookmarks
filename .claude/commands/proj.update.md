/setup
You are given a repository context. Your task is to read `setup.md` and strictly execute all instructions contained in it.

Rules:

- Do not assume anything not explicitly stated.
- Treat `setup.md` as source of truth.
- Execute steps in order.
- If a step requires shell commands, run them.
- If environment variables are required, ask before proceeding.
- If any step fails, stop and report exact error.

Output:

- Short progress updates per step
- Final summary of applied setup changes

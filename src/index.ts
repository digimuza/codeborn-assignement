import { findClasses } from "./main"


async function main() {
  const [files, query] = process.argv.slice(2)
  if (files == null) {
    throw new Error("Expected to receive file directory as first CLI argument")
  }
  if (query == null) {
    throw new Error("Expected to receive query as first argument")
  }
  for await (const x of findClasses(files, query)) {
    console.log(x)
  }

  console.log("DONE")
}

main()
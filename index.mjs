import ts from "typescript"
import fs from "fs"
import tsserver from "typescript/lib/typescriptServices.js"
import { ChildProcess } from "child_process"

const source = `type A = 1;

console.log(A)`

const typeMap = new Map()

/** @type {ts.LanguageService} */

/**
 *
 * @param {ts.TypeChecker} typeChecker
 * @returns
 */
const createTransformer = (typeChecker) => {
  return (context) => {
    return (node) => ts.visitNode(node, visit)
    /**
     *
     * @param {ts.Node} node
     * @returns
     */
    function visit(node) {
      if (node.kind === ts.SyntaxKind.Identifier && node.id) {
        let parent = node.parent
        let symbol
        let symbolFlag
        let typeStr = "error"

        const updateTypeStr = (str) => {
          if (typeStr === "error") typeStr = str
        }
        while (
          !(
            parent &&
            parent.locals instanceof Map &&
            parent.locals.size > 0 &&
            symbolFlag
          ) &&
          parent
        ) {
          const locals = parent.locals
          symbolFlag =
            !!parent.locals && (symbol = locals.get(node.escapedText))
          parent = parent.parent
        }
        if (!symbolFlag) return ts.visitEachChild(node, visit, context)
        // debugger
        const type = typeChecker.getTypeAtLocation(symbol.declarations[0].name)
        // console.log(type)
        if (type.flags & ts.TypeFlags.Object) {
          if (
            type.flags & ts.TypeFlags.Enum ||
            type.flags & ts.TypeFlags.EnumLike ||
            type.flags & ts.TypeFlags.EnumLiteral
          ) {
            return ts.factory.createIdentifier(typeChecker.typeToString(type))
          }
          debugger
          const fields = []
          const properties = type.getProperties()
          for (const prop of properties) {
            // debugger
            const name = prop.getName()
            const propType = typeChecker.getTypeOfSymbolAtLocation(prop, node)
            const propTypeName = typeChecker.typeToString(propType)
            const hasQuestionToken = prop.valueDeclaration ? !!prop.valueDeclaration.questionToken : false
            fields.push(
              `${name}${hasQuestionToken ? "?" : ""}: ${propTypeName};`
            )
          }
          updateTypeStr(fields.length > 0 ? `{\n\t${fields.join("\n   ")}\n}` : '{}')
        } else if (type.flags & ts.TypeFlags.UnionOrIntersection) {
            // debugger
            const fields = []
            for (const prop of type.types) {
                fields.push(typeChecker.typeToString(prop))
            }
            let separator = ''
            if (type.flags & ts.TypeFlags.Union) {
                separator = '|'
            } else if (type.flags & ts.TypeFlags.Intersection) {
                separator = '&'
            }
            updateTypeStr(fields.join(` ${separator} `))
        } else {}
        return ts.factory.createStringLiteral(typeStr)
      }
      // 其它节点保持不变
      return ts.visitEachChild(node, visit, context)
    }
  }
}
const program = ts.createProgram(["./index.ts"], { emitDeclarationOnly: false })
const result = ts.transpileModule(fs.readFileSync("./index.ts").toString(), {
  transformers: { before: [createTransformer(program.getTypeChecker())] },
})

fs.writeFileSync("./index.js", result.outputText)

console.log("编译成功")

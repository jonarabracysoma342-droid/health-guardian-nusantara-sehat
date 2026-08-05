import * as React from "react"
import { cva } from "class-variance-authority"

export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

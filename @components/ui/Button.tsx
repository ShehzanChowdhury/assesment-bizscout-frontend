/*
 * Extend any UI library of your choice.
 * 
 * Guidelines:
 * - Do not use third-party components directly in code (e.g., Button, Select, Input, etc.).
 * - Instead, extend the third-party components in this file to create a consistent API and styling across the application.
 * 
 * Example:
 * The following code extends the Button component from the `flowbite-react` library.
 * 
 * import {
 *   Button as FlowBiteButton,
 *   ButtonProps as FlowButtonProps,
 * } from "flowbite-react";
 * 
 *
 * interface ButtonProps extends FlowButtonProps {}
 * 
 * export default function Button(props: ButtonProps) {
 *   return <FlowBiteButton {...props} />;
 * }
 */

import React from "react";

export default function Button(props: {children: React.ReactNode}) {
  return <button>{props.children}</button>;
}



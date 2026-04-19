import { createClient } from "@libsql/client";

const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY1NDgyMTEsImlkIjoiMDE5ZGEyODYtNTIwMS03YjFiLTk1ODgtOTM1YTJmYWNkZjIwIiwicmlkIjoiZjI1YTNmZGQtNmM0OC00MGE0LTk4YjQtZjM3ZWQ0NWZmNDVmIn0.9FvQaCmahuem22SeBiBYGCOWpx3oRTC-QzNG7TnQV3HfWZEYpBAZe-vJATx1Gl7IgBZAMyE2-AZHGF-PSzBeDQ";
const TURSO_URL = "libsql://showkatshafi-infinitebutdiscrete.aws-eu-west-1.turso.io";

export const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});
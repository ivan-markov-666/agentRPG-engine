export type IssueLevel = 'INFO' | 'WARN' | 'ERROR';

export interface Issue {
  code: string;
  level: IssueLevel;
  message?: string;
  file?: string;
  fix?: string;
}

export interface ConsoleReportOptions {
  debug?: boolean;
  summaryOnly?: boolean;
}

export interface JsonReportOptions {
  append?: boolean;
}

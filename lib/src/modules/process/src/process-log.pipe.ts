import {Pipe, PipeTransform} from "@angular/core";

/**
 * Pipe for processes log strings into structured HTML.
 * It transforms log entries formatted in a specific way, allowing for enhanced readability
 * by converting log data into HTML elements.
 */
@Pipe({
  name: "processLog",
  standalone: true
})
export class ProcessLogPipe implements PipeTransform {

  /**
   * Transforms a log string into an HTML representation.
   * @param value - The log string to be processed.
   * @returns A string containing HTML elements representing the log entries.
   *          If the input value is empty, it returns an empty string.
   */
  transform(value: string): string {
    // Return empty string for falsy values
    if (!value) {
      return "";
    }
    // Split log entries by the delimiter and filter out empty lines
    const lines = value.split(">>>\n").filter(v => v?.length > 0);
    // Parse each line into structured HTML
    const parsedLines = lines.map(line => {
      const parts = line.match(/\[(.*)]/g); // Extract parts enclosed in brackets
      const logData = parts.map(part => {
        // Extract process ID, date, and log level from the matched part
        const [pid, date, level] = part.slice(1, -1).split(" | ");
        return {
          pid: `<span class="pid">${pid}</span>`,
          date: `<span class="date">${date}</span>`,
          level: `<span class="level">${level}</span>`,
          content: line.replace(part, ""), // Remove the part from the line to get the content
          cls: level.toLowerCase(), // Use log level as a CSS class
        };
      });
      // Construct HTML for the log entry
      return `<div class="${logData[0].cls}">`
        + `[${logData[0].pid} ${logData[0].date} ${logData[0].level}]${logData[0].content}</div>`;
    });
    // Reverse the order of log entries and join them into a single string
    return parsedLines.reverse().join("\n");
  }

}

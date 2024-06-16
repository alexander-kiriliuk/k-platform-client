import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "processLog",
  standalone: true
})
export class ProcessLogPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return "";
    }
    const lines = value.split(">>>\n").filter(v => v?.length > 0);
    const parsedLines = lines.map(line => {
      const parts = line.match(/\[(.*)]/g);
      const logData = parts.map(part => {
        const [pid, date, level] = part.slice(1, -1).split(" | ");
        return {
          pid: `<span class="pid">${pid}</span>`,
          date: `<span class="date">${date}</span>`,
          level: `<span class="level">${level}</span>`,
          content: line.replace(part, ""),
          cls: level.toLowerCase(),
        };
      });
      return `<div class="${logData[0].cls}">`
        + `[${logData[0].pid} ${logData[0].date} ${logData[0].level}]${logData[0].content}</div>`;
    });
    return parsedLines.reverse().join("\n");
  }

}

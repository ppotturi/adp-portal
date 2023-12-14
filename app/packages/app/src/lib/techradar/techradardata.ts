// https://github.com/backstage/backstage/blob/master/plugins/tech-radar/src/sample.ts

import { TechRadarApi } from './techradarapi';
  
  export class AdpDataTechRadarApi implements TechRadarApi {
    async load(id: string | undefined) {
      const rawData = "https://raw.githubusercontent.com/defra-adp-sandpit/adp-software-templates/main/tech-radars/development-tech-radar";

      const data = await fetch(rawData).then(res => res.json());

      // For example, this converts the timeline dates into date objects
      return {
        ...data,
        entries: data.entries.map((entry: { timeline: any[]; }) => ({
          ...entry,
          timeline: entry.timeline.map(timeline => ({
            ...timeline,
            date: new Date(timeline.date),
          })),
        })),
      };
    }
  }
// https://github.com/backstage/backstage/blob/master/plugins/tech-radar/src/sample.ts

import {
    RadarRing,
    RadarQuadrant,
    RadarEntry,
    TechRadarLoaderResponse,
    TechRadarApi,
  } from './techradarapi';
  
  const rings = new Array<RadarRing>();
  rings.push({
    id: 'adopt',
    name: 'ADOPT',
    color: '#5BA300',
    description:
      'This technology is recommended for use by the majority of teams with a specific use case.',
  });
  rings.push({
    id: 'trial',
    name: 'TRIAL',
    color: '#009EB0',
    description: 'This technology has been evaluated for specific use cases and has showed clear benefits. Some teams adopt it in production, although it should be limited to low-impact projects as it might incur a higher risk.',
  });
  rings.push({
    id: 'assess',
    name: 'ASSESS',
    color: '#C7BA00',
    description:
      'This technology has the potential to be beneficial for the company. Some teams are evaluating it and using it in experimental projects. Using it in production comes with a high cost and risk due to lack of in-house knowledge, maintenance, and support.',
  });
  rings.push({
    id: 'hold',
    name: 'HOLD',
    color: '#E09B96',
    description: 'We don’t want to further invest in this technology or we evaluated it and we don’t see it as beneficial for the company. Teams should not use it in new projects and should plan on migrating to a supported alternative if they use it for historical reasons. For broadly adopted technologies, the Radar should refer to a migration path to a supported alternative.',
  });
  
  const quadrants = new Array<RadarQuadrant>();
  quadrants.push({ id: 'infrastructure', name: 'Infrastructure' });
  quadrants.push({ id: 'frameworks', name: 'Frameworks' });
  quadrants.push({ id: 'languages', name: 'Languages' });
  quadrants.push({ id: 'process', name: 'Process' });
  
  const entries = new Array<RadarEntry>();
  entries.push({
    timeline: [
      {
        moved: 0,
        ringId: 'adopt',
        date: new Date('2020-08-06'),
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      },
    ],
    key: 'javascript',
    id: 'javascript',
    title: 'JavaScriptss',
    quadrant: 'languages',
    links: [
      {
        url: 'https://www.javascript.com/',
        title: 'Learn more',
      },
      {
        url: 'https://www.typescriptlang.org/',
        title: 'TypeScript',
      },
    ],
    description:
      'Excepteur **sint** occaecat *cupidatat* non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n```ts\nconst x = "3";\n```\n',
  });
  entries.push({
    timeline: [
      {
        moved: -1,
        ringId: 'adopt',
        date: new Date('2020-08-06'),
        description:
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      },
    ],
    key: 'typescript',
    id: 'typescript',
    title: 'TypeScript',
    quadrant: 'languages',
    description:
      'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat',
  });
  entries.push({
    timeline: [
      {
        moved: 1,
        ringId: 'adopt',
        date: new Date('2020-08-06'),
        description:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      },
    ],
    links: [
      {
        url: 'https://webpack.js.org/',
        title: 'Learn more',
      },
    ],
    key: 'webpack',
    id: 'webpack',
    title: 'Webpack',
    quadrant: 'frameworks',
  });
  entries.push({
    timeline: [
      {
        moved: 0,
        ringId: 'adopt',
        date: new Date('2020-08-06'),
        description:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      },
    ],
    links: [
      {
        url: 'https://reactjs.org/',
        title: 'Learn more',
      },
    ],
    key: 'react',
    id: 'react',
    title: 'React',
    quadrant: 'frameworks',
  });
  entries.push({
    timeline: [
      {
        moved: 0,
        ringId: 'adopt',
        date: new Date('2020-08-06'),
        description:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      },
    ],
    key: 'code-reviews',
    id: 'code-reviews',
    title: 'Code Reviews',
    quadrant: 'process',
  });
  entries.push({
    timeline: [
      {
        moved: 0,
        ringId: 'assess',
        date: new Date('2020-08-06'),
        description:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      },
    ],
    key: 'mob-programming',
    id: 'mob-programming',
    title: 'Mob Programming',
    quadrant: 'process',
  });
  entries.push({
    timeline: [
      {
        moved: 0,
        ringId: 'adopt',
        date: new Date('2020-08-06'),
        description:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      },
    ],
    key: 'docs-like-code',
    id: 'docs-like-code',
    title: 'Docs-like-code',
    quadrant: 'process',
  });
  entries.push({
    timeline: [
      {
        moved: -1,
        ringId: 'hold',
        date: new Date('2020-08-06'),
        description:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      },
    ],
    key: 'force-push',
    id: 'force-push',
    title: 'Force push to master',
    quadrant: 'process',
  });
  entries.push({
    timeline: [
      {
        moved: 0,
        ringId: 'adopt',
        date: new Date('2023-11-01'),
        description: 'long description',
      }
    ],
    links: [
      {
        url: 'https://github.com',
        title: 'Learn more',
      },
    ],
    key: 'github-repos',
    id: 'github-repos',
    title: 'GitHub Repos',
    quadrant: 'infrastructure',
  });
  
  export const mock: TechRadarLoaderResponse = {
    entries,
    quadrants,
    rings,
  };
  
  const entries2 = new Array<RadarEntry>();
  entries2.push({
    timeline: [
      {
        moved: 0,
        ringId: 'adopt',
        date: new Date('2020-08-06'),
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      },
    ],
    key: 'javascript',
    id: 'javascript',
    title: 'JavaScriptss',
    quadrant: 'languages',
    links: [
      {
        url: 'https://www.javascript.com/',
        title: 'Learn more',
      },
      {
        url: 'https://www.typescriptlang.org/',
        title: 'TypeScript',
      },
    ],
    description:
      'Excepteur **sint** occaecat *cupidatat* non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n```ts\nconst x = "3";\n```\n',
  });
  export const mock2: TechRadarLoaderResponse = {
    entries: entries2,
    quadrants: quadrants,
    rings: rings,
  };

  export class AdpDataTechRadarApi implements TechRadarApi {
    async load(id: string | undefined) {
      var rawData = "https://raw.githubusercontent.com/defra-adp-sandpit/adp-software-templates/tech-radar/tech-radars/development-tech-radar";

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

      /*if (id == 'dev'){
        return mock2;
      }else{
        return mock;
      }*/
    }
  }
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { ScmIntegrationRegistry, DefaultGithubCredentialsProvider } from '@backstage/integration';
import { Octokit } from 'octokit';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';

export function createGithubTeamAction(options: {
    integrations: ScmIntegrationRegistry;
    config: Config;
}) {
    const { integrations, config } = options;
    return createTemplateAction<{
        githubTeamName: string;
        githubTeamDescription: string;
        orgName: string;
        users: string[];
        access: string;
    }>({
        id: 'adp:github:team:create',
        description: 'Creates a GitHub Team in the organization to add as collaborator',
        schema: {
            input: {
                type: 'object',
                required: ['githubTeamName',
                    'githubTeamDescription',
                    'orgName',
                    'users',
                    'access'],
                properties: {
                    githubTeamName: {
                        title: 'Team name to be created in GitHub organization',
                        description: 'Schema for github team name',
                        type: 'string',
                    },
                    githubTeamDescription: {
                        title: 'GitHub Team description',
                        description: 'Schema for github team description',
                        type: 'string',
                    },
                    orgName: {
                        title: 'GitHub organization name',
                        description: 'Schema for github org name',
                        type: 'string',
                    },
                    users: {
                        title: 'List of usernames to be added to the GitHub team',
                        description: 'Schema for github org name',
                        type: 'array',
                        items: {
                            type: 'string',
                        }
                    },
                    access: {
                        title: 'Access level to be given to the GitHub team',
                        description: 'Schema for access level',
                        type: 'string',
                    }
                },
            },
        },
        async handler(ctx) {
            const { githubTeamName, githubTeamDescription, orgName, users, access } = ctx.input;
            ctx.logger.info(
                `Running github team actions template with parameters: ${ctx.input.githubTeamName}`,
            );
            const credentialsProvider = DefaultGithubCredentialsProvider.fromIntegrations(integrations);
            const organization = orgName ?? config.getString('github.organization');
            const url = `https://${config.getString('github.host')}/${organization}`;
            const credentials = await credentialsProvider.getCredentials({ url: url });

            if (credentials === undefined) {
                throw new InputError(
                    `No credentials provided for ${url}. Check your integrations config.`,
                );
            }

            const octokit = new Octokit({
                auth: credentials.token,
            });

            const team = await octokit.rest.teams.getByName({ org: organization, team_slug: githubTeamName });
            if (team.status !== 200) {
                octokit.rest.teams
                    .create({
                        org: organization,
                        name: githubTeamName,
                        description: githubTeamDescription,
                    })
                    .then((value) => {
                        if (value.status === 201) {
                            ctx.logger.info(
                                `Created team ${ctx.input.githubTeamName} in github org ${organization}`,
                            );
                        }
                    })
                    .catch((err) => {
                        ctx.logger.error(`Creating team ${githubTeamName} failed with error: ${err}`);
                    });
            } else {
                ctx.logger.info(
                    `Team ${ctx.input.githubTeamName} already exists in github org ${organization}`,
                );
            }

            users.forEach(async (user) => {
                octokit.rest.teams
                    .addOrUpdateMembershipForUserInOrg({ org: organization, team_slug: githubTeamName, username: user })
                    .then((value) => {
                        if (value.status === 200) {
                            ctx.logger.info(`Added user ${user} to the team successfully and the state is ${value.data.state}`);
                        }
                    })
                    .catch((err) => {
                        ctx.logger.error(`Adding user ${user} to the team failed with error: ${err}`);
                    });
            });
        },
    });
}

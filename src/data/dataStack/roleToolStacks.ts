import type { PlayerRoleId, ProjectKind } from './projectPaths'

/** Outil de la stack rôle (marché) — max 10 par rôle. */
export interface RoleStackTool {
  id: string
  name: string
}

export type RoleStackKey = `${ProjectKind}__${PlayerRoleId}`

/**
 * 10 outils incontournables par rôle × type de projet.
 * Priorité : fréquence offres FR + usage marché large.
 * Gouvernance : DataGalaxy (pas Collibra).
 */
export const ROLE_TOOL_STACKS: Partial<Record<RoleStackKey, readonly RoleStackTool[]>> = {
  'it__business-analyst': [
    { id: 'jira', name: 'Jira' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'sql', name: 'SQL' },
    { id: 'excel', name: 'Excel' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'miro', name: 'Miro' },
    { id: 'azure-devops', name: 'Azure DevOps' },
    { id: 'visio', name: 'Visio / draw.io' },
    { id: 'salesforce', name: 'Salesforce' },
  ],
  'it__chef-de-projet': [
    { id: 'jira', name: 'Jira' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'excel', name: 'Excel' },
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'ms-project', name: 'MS Project / Planner' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'sharepoint', name: 'SharePoint' },
    { id: 'miro', name: 'Miro' },
    { id: 'azure-devops', name: 'Azure DevOps' },
    { id: 'servicenow', name: 'ServiceNow' },
  ],
  'it__product-owner': [
    { id: 'jira', name: 'Jira' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'miro', name: 'Miro' },
    { id: 'figma', name: 'Figma' },
    { id: 'excel', name: 'Excel' },
    { id: 'azure-devops', name: 'Azure DevOps' },
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'sql', name: 'SQL' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'notion', name: 'Notion' },
  ],
  'it__scrum-master': [
    { id: 'jira', name: 'Jira' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'miro', name: 'Miro' },
    { id: 'azure-devops', name: 'Azure DevOps' },
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'excel', name: 'Excel' },
    { id: 'slack', name: 'Slack' },
    { id: 'sharepoint', name: 'SharePoint' },
    { id: 'notion', name: 'Notion' },
    { id: 'powerbi', name: 'Power BI' },
  ],
  'it__technico-fonctionnel': [
    { id: 'sql', name: 'SQL' },
    { id: 'jira', name: 'Jira' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'excel', name: 'Excel' },
    { id: 'postman', name: 'Postman' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'azure-devops', name: 'Azure DevOps' },
    { id: 'git', name: 'Git / GitLab' },
    { id: 'salesforce', name: 'Salesforce' },
    { id: 'teams', name: 'Microsoft Teams' },
  ],
  'data-ai__business-analyst': [
    { id: 'sql', name: 'SQL' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'jira', name: 'Jira' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'excel', name: 'Excel' },
    { id: 'python', name: 'Python' },
    { id: 'tableau', name: 'Tableau' },
    { id: 'bigquery', name: 'BigQuery' },
    { id: 'miro', name: 'Miro' },
    { id: 'dbt', name: 'dbt' },
  ],
  'data-ai__chef-de-projet': [
    { id: 'jira', name: 'Jira' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'excel', name: 'Excel' },
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'databricks', name: 'Databricks' },
    { id: 'sql', name: 'SQL' },
    { id: 'miro', name: 'Miro' },
    { id: 'airflow', name: 'Airflow' },
    { id: 'azure-devops', name: 'Azure DevOps' },
  ],
  'data-ai__product-owner': [
    { id: 'jira', name: 'Jira' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'miro', name: 'Miro' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'sql', name: 'SQL' },
    { id: 'excel', name: 'Excel' },
    { id: 'databricks', name: 'Databricks' },
    { id: 'dbt', name: 'dbt' },
    { id: 'figma', name: 'Figma' },
    { id: 'teams', name: 'Microsoft Teams' },
  ],
  'data-ai__scrum-master': [
    { id: 'jira', name: 'Jira' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'miro', name: 'Miro' },
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'azure-devops', name: 'Azure DevOps' },
    { id: 'excel', name: 'Excel' },
    { id: 'slack', name: 'Slack' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'databricks', name: 'Databricks' },
    { id: 'notion', name: 'Notion' },
  ],
  'data-ai__technico-fonctionnel': [
    { id: 'sql', name: 'SQL' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'python', name: 'Python' },
    { id: 'jira', name: 'Jira' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'excel', name: 'Excel' },
    { id: 'dbt', name: 'dbt' },
    { id: 'bigquery', name: 'BigQuery' },
    { id: 'databricks', name: 'Databricks' },
    { id: 'postman', name: 'Postman' },
  ],
  'data-ai__data-manager': [
    { id: 'datagalaxy', name: 'DataGalaxy' },
    { id: 'sql', name: 'SQL' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'excel', name: 'Excel' },
    { id: 'jira', name: 'Jira' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'python', name: 'Python' },
    { id: 'bigquery', name: 'BigQuery' },
    { id: 'purview', name: 'Microsoft Purview' },
    { id: 'teams', name: 'Microsoft Teams' },
  ],
  'data-ai__data-steward': [
    { id: 'datagalaxy', name: 'DataGalaxy' },
    { id: 'excel', name: 'Excel' },
    { id: 'sql', name: 'SQL' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'jira', name: 'Jira' },
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'sharepoint', name: 'SharePoint' },
    { id: 'purview', name: 'Microsoft Purview' },
    { id: 'notion', name: 'Notion' },
  ],
  'data-ai__data-governance-manager': [
    { id: 'datagalaxy', name: 'DataGalaxy' },
    { id: 'purview', name: 'Microsoft Purview' },
    { id: 'sql', name: 'SQL' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'jira', name: 'Jira' },
    { id: 'excel', name: 'Excel' },
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'onetrust', name: 'OneTrust' },
    { id: 'bigquery', name: 'BigQuery' },
  ],
  'data-ai__ai-governance-manager': [
    { id: 'datagalaxy', name: 'DataGalaxy' },
    { id: 'purview', name: 'Microsoft Purview' },
    { id: 'python', name: 'Python' },
    { id: 'mlflow', name: 'MLflow' },
    { id: 'confluence', name: 'Confluence' },
    { id: 'jira', name: 'Jira' },
    { id: 'excel', name: 'Excel' },
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'powerbi', name: 'Power BI' },
    { id: 'sql', name: 'SQL' },
  ],
}

export function roleStackKey(kind: ProjectKind, role: PlayerRoleId): RoleStackKey {
  return `${kind}__${role}`
}

export function toolsForRole(
  kind: ProjectKind,
  role: PlayerRoleId,
): readonly RoleStackTool[] {
  return ROLE_TOOL_STACKS[roleStackKey(kind, role)] ?? []
}

export function assertRoleStacks(): void {
  for (const [key, tools] of Object.entries(ROLE_TOOL_STACKS)) {
    if (tools.length !== 10) {
      throw new Error(`${key} must have exactly 10 tools, got ${tools.length}`)
    }
  }
}

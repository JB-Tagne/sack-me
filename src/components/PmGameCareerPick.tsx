import {
  PROJECT_KINDS,
  rolesForProject,
  type PlayerRoleId,
  type ProjectKind,
} from '../data/dataStack/projectPaths'
import {
  MUTUALIS_ENTITIES,
  MUTUALIS_GROUP_NAME,
  type MutualisEntityId,
} from '../data/dataStack/mutualisEntities'
import { roleStory } from '../data/dataStack/roleStories'
import { toolsForRole } from '../data/dataStack/roleToolStacks'
import { usePmGameI18n } from '../i18n/PmGameI18n'

interface PmGameCareerPickProps {
  projectKind?: ProjectKind
  playerRole?: PlayerRoleId
  homeEntity?: MutualisEntityId
  onSelectProject: (kind: ProjectKind) => void
  onSelectRole: (role: PlayerRoleId) => void
  onSelectHomeEntity: (id: MutualisEntityId) => void
  onContinue: () => void
}

/** Choix entreprise Mutualis + type de projet + rôle. */
export function PmGameCareerPick({
  projectKind,
  playerRole,
  homeEntity,
  onSelectProject,
  onSelectRole,
  onSelectHomeEntity,
  onContinue,
}: PmGameCareerPickProps) {
  const { locale, t } = usePmGameI18n()
  const roles = projectKind ? rolesForProject(projectKind) : []
  const canContinue = Boolean(projectKind && playerRole && homeEntity)
  const stack =
    projectKind && playerRole ? toolsForRole(projectKind, playerRole) : []
  const story =
    projectKind && playerRole ? roleStory(projectKind, playerRole, locale) : null
  const home = MUTUALIS_ENTITIES.find((e) => e.id === homeEntity)

  return (
    <section className="adventure-panel adventure-enter pm-career-pick">
      <div className="adventure-brief-block">
        <h2 tabIndex={-1}>{t('careerPick.title')}</h2>
        <p className="pm-career-pick-lead">{t('careerPick.lead')}</p>

        <h3 className="pm-career-pick-section">{t('careerPick.home')}</h3>
        <p className="pm-career-pick-stack-lead">{t('careerPick.homeLead')}</p>
        <div className="pm-career-pick-roles" role="group" aria-label={t('careerPick.home')}>
          {MUTUALIS_ENTITIES.map((e) => {
            const selected = homeEntity === e.id
            return (
              <button
                key={e.id}
                type="button"
                className={`pm-career-pick-role${selected ? ' is-selected' : ''}`}
                aria-pressed={selected}
                onClick={() => onSelectHomeEntity(e.id)}
              >
                <span className="pm-career-pick-role-name">{e.name}</span>
                <span className="pm-career-pick-role-track">{e.domain[locale]}</span>
              </button>
            )
          })}
        </div>

        <h3 className="pm-career-pick-section">{t('careerPick.project')}</h3>
        <div className="pm-career-pick-grid" role="group" aria-label={t('careerPick.project')}>
          {PROJECT_KINDS.map((p) => {
            const selected = projectKind === p.id
            return (
              <button
                key={p.id}
                type="button"
                className={`pm-career-pick-card${selected ? ' is-selected' : ''}`}
                aria-pressed={selected}
                onClick={() => onSelectProject(p.id)}
              >
                <strong>{p.label[locale]}</strong>
                <span>{p.hint[locale]}</span>
              </button>
            )
          })}
        </div>

        {projectKind && (
          <>
            <h3 className="pm-career-pick-section">{t('careerPick.role')}</h3>
            <div className="pm-career-pick-roles" role="group" aria-label={t('careerPick.role')}>
              {roles.map((r) => {
                const selected = playerRole === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={`pm-career-pick-role${selected ? ' is-selected' : ''}`}
                    aria-pressed={selected}
                    onClick={() => onSelectRole(r.id)}
                  >
                    <span className="pm-career-pick-role-name">{r.label[locale]}</span>
                    <span className="pm-career-pick-role-track">
                      {r.track === 'governance'
                        ? t('careerPick.track.gov')
                        : t('careerPick.track.pm')}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {story && home && (
          <aside className="pm-career-pick-story" aria-label={t('careerPick.story')}>
            <h3 className="pm-career-pick-section">{t('careerPick.story')}</h3>
            <p className="pm-career-pick-story-code">
              <strong>{story.codename}</strong>
              <span>
                {' '}
                · {home.name} · {MUTUALIS_GROUP_NAME}
              </span>
            </p>
            <p>{story.tagline.replace(/Mutualis Retail/gi, home.name)}</p>
            <p className="pm-career-pick-story-stakes">{t('careerPick.castHint')}</p>
          </aside>
        )}

        {stack.length > 0 && (
          <>
            <h3 className="pm-career-pick-section">{t('careerPick.stack')}</h3>
            <p className="pm-career-pick-stack-lead">{t('careerPick.stackLead')}</p>
            <ul className="pm-career-pick-stack" aria-label={t('careerPick.stack')}>
              {stack.map((tool) => (
                <li key={tool.id}>{tool.name}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="adventure-actions">
        <button
          type="button"
          className="btn adventure-cta"
          disabled={!canContinue}
          onClick={onContinue}
        >
          {t('careerPick.continue')}
        </button>
      </div>
    </section>
  )
}

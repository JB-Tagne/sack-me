import { useId, useRef, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react'
import type { StepExpect } from '../data/dataStack/adventure'
import { expectMeta } from '../data/dataStack/adventure'
import { usePmGameI18n } from '../i18n/PmGameI18n'

export interface DeliverablePadProps {
  expect: StepExpect
  text: string
  fileName?: string
  fileDataUrl?: string
  onTextChange: (value: string) => void
  onFileChange: (file: File | null) => void
}

function onCodeKeyDown(
  e: KeyboardEvent<HTMLTextAreaElement>,
  value: string,
  onChange: (next: string) => void,
) {
  if (e.key !== 'Tab') return
  e.preventDefault()
  const el = e.currentTarget
  const start = el.selectionStart
  const end = el.selectionEnd
  const next = `${value.slice(0, start)}  ${value.slice(end)}`
  onChange(next)
  requestAnimationFrame(() => {
    el.selectionStart = el.selectionEnd = start + 2
  })
}

export function DeliverablePad({
  expect,
  text,
  fileName,
  fileDataUrl,
  onTextChange,
  onFileChange,
}: DeliverablePadProps) {
  const { locale } = usePmGameI18n()
  const meta = expectMeta(expect, locale)
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleTextArea(e: ChangeEvent<HTMLTextAreaElement>) {
    onTextChange(e.target.value)
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    onFileChange(e.target.files?.[0] ?? null)
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) onFileChange(file)
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  function onDropzoneKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openFilePicker()
    }
  }

  if (expect === 'screenshot') {
    return (
      <div className="deliverable-pad deliverable-pad--screenshot">
        <div className="deliverable-pad-head">
          <strong>{meta.title}</strong>
          <span>{meta.hint}</span>
        </div>

        <div
          className={`deliverable-dropzone${fileDataUrl ? ' has-file' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Zone de dépôt pour capture d’écran. Entrée ou Espace pour choisir un fichier."
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onKeyDown={onDropzoneKeyDown}
          onClick={openFilePicker}
        >
          {fileDataUrl?.startsWith('data:image') ? (
            <img src={fileDataUrl} alt="Aperçu de la capture" className="deliverable-preview" />
          ) : (
            <p className="deliverable-drop-hint">
              Glisse une capture ici, ou appuie Entrée / Espace pour choisir un fichier image
              (PNG, JPG, WebP).
            </p>
          )}
          <div className="deliverable-drop-actions">
            <label
              className="btn secondary"
              htmlFor={inputId}
              onClick={(e) => e.stopPropagation()}
            >
              {fileName ? 'Changer la capture' : 'Joindre une capture'}
            </label>
            <input
              id={inputId}
              ref={fileInputRef}
              className="visually-hidden"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileInput}
            />
            {fileName && (
              <button
                type="button"
                className="btn secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  onFileChange(null)
                }}
              >
                Retirer
              </button>
            )}
          </div>
          {fileName && (
            <p className="deliverable-file-name">
              Joint : <strong>{fileName}</strong>
            </p>
          )}
        </div>

        <label className="deliverable-caption-label" htmlFor={`${inputId}-caption`}>
          Commentaire / mesure (optionnel mais utile)
        </label>
        <textarea
          id={`${inputId}-caption`}
          rows={4}
          value={text}
          onChange={handleTextArea}
          aria-label="Commentaire sur la capture"
        />
      </div>
    )
  }

  if (expect === 'python' || expect === 'sql') {
    const lang = expect === 'python' ? 'Python' : 'SQL'
    return (
      <div className={`deliverable-pad deliverable-pad--notebook deliverable-pad--${expect}`}>
        <div className="deliverable-pad-head">
          <strong>{meta.title}</strong>
          <span>{meta.hint}</span>
        </div>

        <div className="notebook-chrome" aria-label={`Cellule ${lang}`}>
          <div className="notebook-cell-bar">
            <span className="notebook-prompt">In [ ]:</span>
            <span className={`notebook-lang notebook-lang--${expect}`}>{lang}</span>
            <span className="notebook-cell-type">Code</span>
          </div>
          <textarea
            className="notebook-cell-input"
            rows={12}
            spellCheck={false}
            value={text}
            onChange={handleTextArea}
            onKeyDown={(e) => onCodeKeyDown(e, text, onTextChange)}
            aria-label={`Script ${lang}`}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="deliverable-pad deliverable-pad--text">
      <div className="deliverable-pad-head">
        <strong>{meta.title}</strong>
        <span>{meta.hint}</span>
      </div>
      <textarea
        rows={6}
        value={text}
        onChange={handleTextArea}
        aria-label="Réponse texte"
      />
    </div>
  )
}

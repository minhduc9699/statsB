// Centralized state shape documentation for Redux slices
// Not enforced at runtime, but useful for reference and future validation

/**
 * Video State
 * {
 *   currentTime: number,
 *   duration: number,
 *   isPaused: boolean,
 *   videoFile: string | null
 * }
 *
 * Events State
 * {
 *   list: Array<Event>,
 *   selectedEventId: string | null,
 *   filterOptions: {
 *     playerIds: Array<string>,
 *     eventTypes: Array<string>
 *   }
 * }
 *
 * Players State
 * {
 *   list: Array<Player>,
 *   selectedPlayerId: string | null
 * }
 *
 * UI State
 * {
 *   showPlayerModal: boolean,
 *   showExportModal: boolean,
 *   activeTab: string,
 *   toastMessages: Array<string>
 * }
 */

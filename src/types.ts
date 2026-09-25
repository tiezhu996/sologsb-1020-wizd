export type RecordGroup = 'A' | 'B';
export type MatchStatus = 'suggested' | 'confirmed' | 'rejected' | 'merged';
export type FieldKey = 'title' | 'date' | 'people' | 'places' | 'identifier' | 'medium' | 'extent' | 'rights' | 'notes';

export type UserRejectReason = 'different-records' | 'insufficient-evidence' | 'duplicate-candidate' | 'other';
export type SystemRejectReason = 'superseded' | 'records-merged';
export type RejectReasonId = UserRejectReason | SystemRejectReason;

export const REJECT_REASON_OPTIONS: Array<{ id: UserRejectReason; label: string }> = [
  { id: 'different-records', label: '不是同一条记录' },
  { id: 'insufficient-evidence', label: '证据不足，暂不确认' },
  { id: 'duplicate-candidate', label: '与另一候选重复' },
  { id: 'other', label: '其他原因' }
];

export const REJECT_REASON_LABELS: Record<RejectReasonId, string> = {
  'different-records': '不是同一条记录',
  'insufficient-evidence': '证据不足，暂不确认',
  'duplicate-candidate': '与另一候选重复',
  other: '其他原因',
  superseded: '被新确认匹配挤掉',
  'records-merged': '关联记录已合并'
};

export const rejectReasonLabel = (id?: string) =>
  id && id in REJECT_REASON_LABELS ? REJECT_REASON_LABELS[id as RejectReasonId] : '';

export interface ArchiveRecord {
  id: string;
  group: RecordGroup;
  title: string;
  date: string;
  people: string[];
  places: string[];
  identifier: string;
  medium: string;
  extent: string;
  rights: string;
  notes: string;
  updatedAt: string;
  status: 'unreviewed' | 'confirmed' | 'rejected' | 'merged';
}

export interface MatchCandidate {
  id: string;
  leftId: string;
  rightId: string;
  score: number;
  fieldScores: Record<FieldKey, number>;
  status: MatchStatus;
  reasons: string[];
  reviewedAt?: string;
  rejectReason?: RejectReasonId;
  supersededBy?: string;
}

export interface MergeResult {
  id: string;
  matchId: string;
  leftId: string;
  rightId: string;
  chosen: Partial<Record<FieldKey, RecordGroup | 'combine'>>;
  values: Partial<Record<FieldKey, string>>;
  mergedAt: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  action: string;
  detail: string;
  recordIds: string[];
  before?: string;
  after?: string;
}

export interface ArchiveState {
  revision: number;
  records: ArchiveRecord[];
  matches: MatchCandidate[];
  merges: MergeResult[];
  audit: AuditEntry[];
  activeMatchId: string;
  selectedRecordIds: string[];
  hydrated: boolean;
}

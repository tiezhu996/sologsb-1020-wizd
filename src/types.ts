export type RecordGroup = 'A' | 'B';
export type MatchStatus = 'suggested' | 'confirmed' | 'rejected' | 'merged';
export type FieldKey = 'title' | 'date' | 'people' | 'places' | 'identifier' | 'medium' | 'extent' | 'rights' | 'notes';

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
  ignoreReason?: IgnoreReasonCode;
  supersededByMatchId?: string;
}

export const MANUAL_IGNORE_REASON_CODES = [
  'not_same_record',
  'different_entity',
  'conflicting_metadata',
  'duplicate_resolved',
  'low_score'
] as const;
export type ManualIgnoreReasonCode = (typeof MANUAL_IGNORE_REASON_CODES)[number];
export type IgnoreReasonCode = ManualIgnoreReasonCode | 'superseded' | 'merged_away';

export const MANUAL_IGNORE_REASONS: ReadonlyArray<{ code: ManualIgnoreReasonCode; label: string; hint: string }> = [
  { code: 'not_same_record', label: '并非同一档案', hint: '两条记录描述的不是同一件档案，只是标题或信息相近' },
  { code: 'different_entity', label: '相关人物或机构不同', hint: '名称相近，但指向不同的人、家族或机构' },
  { code: 'conflicting_metadata', label: '关键元数据冲突', hint: '日期、编号、载体等关键字段互相矛盾' },
  { code: 'duplicate_resolved', label: '已由另一条匹配处理', hint: '记录已在其他匹配中确认，本条属于重复配对' },
  { code: 'low_score', label: '相似度不足，系统误配', hint: '综合比对得分不足以支持同一档案判断' }
];

export const IGNORE_REASON_LABELS: Record<IgnoreReasonCode, string> = {
  not_same_record: '并非同一档案',
  different_entity: '相关人物或机构不同',
  conflicting_metadata: '关键元数据冲突',
  duplicate_resolved: '已由另一条匹配处理',
  low_score: '相似度不足，系统误配',
  superseded: '被后确认的匹配挤掉',
  merged_away: '因相关记录已合并而失效'
};

export const ignoreReasonLabel = (code: string | undefined): string =>
  code ? (IGNORE_REASON_LABELS as Record<string, string>)[code] ?? code : '未记录原因（旧版进度）';

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

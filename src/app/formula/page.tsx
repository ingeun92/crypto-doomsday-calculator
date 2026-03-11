import Link from 'next/link';

function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="font-display text-lg font-bold text-[var(--text-primary)] tracking-tight mt-12 mb-4 flex items-center gap-2"
    >
      <span className="w-1 h-5 rounded-full bg-[var(--accent-blue)] shrink-0" />
      {children}
    </h2>
  );
}

function FormulaBlock({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="my-4 rounded-xl p-5 space-y-2" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
      {label && (
        <p className="text-[10px] font-medium tracking-wider uppercase text-[var(--accent-blue)] mb-2">{label}</p>
      )}
      <div className="font-display text-sm tabular-nums text-[var(--text-primary)] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function InfoCard({ title, children, variant = 'default' }: { title: string; children: React.ReactNode; variant?: 'default' | 'warning' | 'success' }) {
  const borderColor = variant === 'warning' ? 'var(--accent-amber)' : variant === 'success' ? 'var(--accent-green)' : 'var(--accent-blue)';
  return (
    <div className="my-4 rounded-xl p-5 border-l-2" style={{ backgroundColor: 'var(--bg-elevated)', borderLeftColor: borderColor, borderTop: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <p className="text-xs font-semibold mb-2" style={{ color: borderColor }}>{title}</p>
      <div className="text-xs text-[var(--text-secondary)] leading-relaxed space-y-1.5">
        {children}
      </div>
    </div>
  );
}

function TableRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <td className="py-2.5 pr-4 text-xs text-[var(--text-tertiary)]">{label}</td>
      <td className={`py-2.5 text-xs font-display tabular-nums ${highlight ? 'font-semibold text-[var(--accent-green)]' : 'text-[var(--text-secondary)]'}`}>{value}</td>
    </tr>
  );
}

export default function FormulaPage() {
  return (
    <main className="noise-overlay min-h-screen text-[var(--text-primary)]">
      <div className="max-w-2xl mx-auto px-5 py-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors mb-8"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          계산기로 돌아가기
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--accent-blue)] mb-2">
            Tax Calculation Formula
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
            가상자산 세액 산출 공식
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
            본 계산기에서 사용하는 세액 산출 공식과 그 근거를 상세히 설명합니다.
            2027년 1월 1일 시행 예정인 소득세법 제37조, 제84조 등에 근거합니다.
          </p>
        </div>

        {/* TOC */}
        <nav className="card p-4 mb-8">
          <p className="text-[10px] font-medium tracking-wider uppercase text-[var(--text-tertiary)] mb-3">목차</p>
          <ul className="space-y-1.5">
            {[
              { id: 'overview', label: '1. 과세 개요' },
              { id: 'cost-basis', label: '2. 취득가액 산정 (Cost Basis)' },
              { id: 'tax-calc', label: '3. 세액 계산 공식' },
              { id: 'storage', label: '4. 보관 위치별 산정 방식' },
              { id: 'unprovable', label: '5. 입증 불가 자산 리스크' },
              { id: 'ideal', label: '6. 절세 시뮬레이션' },
              { id: 'example', label: '7. 계산 예시' },
            ].map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className="text-xs text-[var(--accent-blue)] hover:underline">{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 1. 과세 개요 */}
        <SectionTitle id="overview">1. 과세 개요</SectionTitle>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          2027년 1월 1일부터 가상자산 양도·대여로 발생하는 소득은 <strong className="text-[var(--text-primary)]">기타소득</strong>으로
          분류되어 분리과세됩니다.
        </p>

        <div className="my-4 grid grid-cols-2 gap-3">
          <div className="card p-4 text-center">
            <p className="text-[10px] text-[var(--text-tertiary)] mb-1">세율</p>
            <p className="font-display text-xl font-bold text-[var(--accent-red)]">22%</p>
            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">소득세 20% + 지방세 2%</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-[10px] text-[var(--text-tertiary)] mb-1">기본공제</p>
            <p className="font-display text-xl font-bold text-[var(--accent-green)]">250만원</p>
            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">연간 기본공제액</p>
          </div>
        </div>

        <InfoCard title="과세 대상">
          <p>가상자산을 양도(매도)하거나 대여하여 발생하는 소득이 과세 대상입니다.</p>
          <p>가상자산 간 교환(예: BTC → ETH)도 양도로 간주되어 과세됩니다.</p>
        </InfoCard>

        {/* 2. 취득가액 산정 */}
        <SectionTitle id="cost-basis">2. 취득가액 산정 (Cost Basis)</SectionTitle>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          취득가액은 자산을 취득하는 데 실제로 지출한 금액입니다.
          과세 시행 전 보유 자산에 대해서는 <strong className="text-[var(--text-primary)]">의제취득가액</strong> 제도가 적용됩니다.
        </p>

        <FormulaBlock label="의제취득가액 공식">
          <p>Cost_base = <strong>max</strong>(P_buy, P_2026.12.31)</p>
          <div className="mt-3 space-y-1 text-xs text-[var(--text-tertiary)]">
            <p>P_buy = 실제 매수 평균 단가</p>
            <p>P_2026.12.31 = 2026년 12월 31일 시가</p>
          </div>
        </FormulaBlock>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          실제 매수가와 과세 시행 직전 시가 중 <strong className="text-[var(--text-primary)]">높은 금액</strong>을
          취득가액으로 인정받을 수 있습니다. 이를 통해 과세 시행 전 발생한 이익에 대한 이중과세를 방지합니다.
        </p>

        <InfoCard title="의제취득가액이란?" variant="success">
          <p>2026년 12월 31일 이전에 이미 보유하고 있던 자산에 대해, 실제 매수가격과 2026년 12월 31일 시가 중 높은 금액을 취득가액으로 인정하는 제도입니다.</p>
          <p>예를 들어, BTC를 3,000만원에 매수했는데 2026.12.31 시가가 5,000만원이라면, 5,000만원이 취득가액이 됩니다.</p>
        </InfoCard>

        {/* 3. 세액 계산 */}
        <SectionTitle id="tax-calc">3. 세액 계산 공식</SectionTitle>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          최종 납부 세액은 다음 공식으로 산출됩니다.
        </p>

        <FormulaBlock label="양도차익">
          <p>Profit = P_sell &times; Q &minus; Cost_base &times; Q</p>
          <div className="mt-3 space-y-1 text-xs text-[var(--text-tertiary)]">
            <p>P_sell = 매도 가격</p>
            <p>Q = 매도 수량</p>
            <p>Cost_base = 취득가액 단가</p>
          </div>
        </FormulaBlock>

        <FormulaBlock label="과세표준">
          <p>Taxable = <strong>max</strong>(0, Profit &minus; 2,500,000)</p>
          <div className="mt-3 space-y-1 text-xs text-[var(--text-tertiary)]">
            <p>연간 기본공제 250만원을 차감합니다.</p>
            <p>양도차익이 250만원 이하이면 세금이 없습니다.</p>
          </div>
        </FormulaBlock>

        <FormulaBlock label="최종 세액">
          <p>Tax = Taxable &times; <strong>0.22</strong></p>
          <div className="mt-3 space-y-1 text-xs text-[var(--text-tertiary)]">
            <p>소득세 20% + 지방소득세 2% = 22%</p>
          </div>
        </FormulaBlock>

        {/* 4. 보관 위치별 산정 방식 */}
        <SectionTitle id="storage">4. 보관 위치별 산정 방식</SectionTitle>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          가상자산의 보관 위치에 따라 취득가액 산정에 적용되는 회계 방식이 달라집니다.
        </p>

        <div className="my-4 overflow-hidden rounded-xl" style={{ border: '1px solid var(--border-subtle)' }}>
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-elevated)' }}>
                <th className="text-left py-3 px-4 text-[var(--text-tertiary)] font-medium">보관 위치</th>
                <th className="text-left py-3 px-4 text-[var(--text-tertiary)] font-medium">산정 방식</th>
                <th className="text-left py-3 px-4 text-[var(--text-tertiary)] font-medium">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td className="py-3 px-4 text-[var(--text-primary)] font-medium">국내 거래소</td>
                <td className="py-3 px-4">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: 'rgba(52,211,153,0.1)', color: '#34d399' }}>이동평균법</span>
                </td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">매수 시마다 평균 단가를 재계산하여 유리한 취득가액 산정</td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td className="py-3 px-4 text-[var(--text-primary)] font-medium">해외 거래소</td>
                <td className="py-3 px-4">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: 'rgba(240,185,85,0.1)', color: '#f0b955' }}>선입선출법</span>
                </td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">먼저 산 것을 먼저 판 것으로 처리 (저가 매수분 우선 매도)</td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td className="py-3 px-4 text-[var(--text-primary)] font-medium">개인지갑 / DeFi</td>
                <td className="py-3 px-4">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: 'rgba(240,185,85,0.1)', color: '#f0b955' }}>선입선출법</span>
                </td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">거래소 외 보관 시 FIFO 적용, 취득가액 입증 부담 증가</td>
              </tr>
            </tbody>
          </table>
        </div>

        <FormulaBlock label="FIFO 패널티 모델 (본 계산기 시뮬레이션)">
          <p>Adjusted_Cost = Cost_base &times; (1 &minus; <strong>0.15</strong>)</p>
          <div className="mt-3 space-y-1 text-xs text-[var(--text-tertiary)]">
            <p>선입선출법(FIFO)은 저가 매수분이 먼저 매도 처리되므로, 이동평균법 대비 취득가액이 불리하게 산정됩니다.</p>
            <p>본 계산기에서는 이 차이를 약 15%로 시뮬레이션합니다.</p>
          </div>
        </FormulaBlock>

        <InfoCard title="왜 보관 위치가 중요한가?" variant="warning">
          <p>국내 거래소는 이동평균법을 적용하여 취득가액이 유리하게 산정됩니다. 반면, 해외 거래소나 개인지갑(DeFi)은 선입선출법(FIFO)이 적용되어 초기 저가 매수분이 먼저 매도 처리되므로 양도차익이 커지고 세금이 증가합니다.</p>
          <p>따라서 과세 시행 전 국내 거래소로 자산을 이전하면 절세에 유리합니다.</p>
        </InfoCard>

        {/* 5. 입증 불가 자산 */}
        <SectionTitle id="unprovable">5. 입증 불가 자산 리스크</SectionTitle>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          에어드랍, 스테이킹 보상, 하드포크 등으로 취득한 자산은 매수 단가를 입증하기 어려울 수 있습니다.
          입증하지 못할 경우 취득가액이 0원으로 간주되어 매도 금액 전체가 양도차익으로 산정됩니다.
        </p>

        <FormulaBlock label="입증 불가 자산 포함 시 취득가액">
          <p>Cost = Cost_base &times; Q &times; (1 &minus; R) + P_sell &times; Q &times; R &times; 0.5</p>
          <div className="mt-3 space-y-1 text-xs text-[var(--text-tertiary)]">
            <p>R = 입증 불가 자산 비율 (본 계산기에서는 30% 가정)</p>
            <p>입증 불가 자산에 대해 50% 의제경비율을 적용합니다.</p>
            <p>즉, 해당 물량의 매도가의 50%만 취득가액으로 인정됩니다.</p>
          </div>
        </FormulaBlock>

        <InfoCard title="의제경비율이란?" variant="warning">
          <p>취득가액을 입증하지 못할 경우, 양도가액의 일정 비율을 필요경비로 인정해 주는 제도입니다. 가상자산의 경우 50%가 논의되고 있으나, 확정되지 않았으며 0%가 될 수도 있습니다.</p>
          <p>반드시 에어드랍 수령 시점의 트랜잭션 해시, 스냅샷 기록, 거래소 이체 내역 등 증빙 자료를 보관하세요.</p>
        </InfoCard>

        {/* 6. 절세 시뮬레이션 */}
        <SectionTitle id="ideal">6. 절세 시뮬레이션</SectionTitle>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          본 계산기는 &ldquo;방치 시&rdquo;와 &ldquo;솔루션 적용 시&rdquo; 두 가지 시나리오를 비교합니다.
        </p>

        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="card p-4 border-l-2" style={{ borderLeftColor: 'var(--accent-red)' }}>
            <p className="text-[10px] font-medium text-[var(--accent-red)] uppercase tracking-wider mb-2">방치 시 (Current)</p>
            <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
              <li>- 현재 보관 위치 기준 산정 방식 적용</li>
              <li>- FIFO 패널티 반영 (해외/DeFi)</li>
              <li>- 입증 불가 자산 리스크 반영</li>
            </ul>
          </div>
          <div className="card p-4 border-l-2" style={{ borderLeftColor: 'var(--accent-green)' }}>
            <p className="text-[10px] font-medium text-[var(--accent-green)] uppercase tracking-wider mb-2">솔루션 적용 시 (Ideal)</p>
            <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
              <li>- 국내 거래소 이전 (이동평균법)</li>
              <li>- FIFO 패널티 없음</li>
              <li>- 입증 불가 자산 소명 완료</li>
            </ul>
          </div>
        </div>

        <FormulaBlock label="절세 금액">
          <p>Tax_saved = Tax_current &minus; Tax_ideal</p>
          <div className="mt-3 space-y-1 text-xs text-[var(--text-tertiary)]">
            <p>Tax_current = 현재 상태 기준 예상 세액</p>
            <p>Tax_ideal = 모든 절세 전략 적용 후 예상 세액</p>
          </div>
        </FormulaBlock>

        {/* 7. 계산 예시 */}
        <SectionTitle id="example">7. 계산 예시</SectionTitle>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          해외 거래소에 BTC 1개를 보유하고 있는 경우의 계산 예시입니다.
        </p>

        <div className="my-4 rounded-xl p-5" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <p className="text-[10px] font-medium tracking-wider uppercase text-[var(--text-tertiary)] mb-3">입력 조건</p>
          <table className="w-full text-xs">
            <tbody>
              <TableRow label="보관 위치" value="해외 거래소 (FIFO 적용)" />
              <TableRow label="매수 평균가" value="30,000,000원" />
              <TableRow label="2026.12.31 시가" value="50,000,000원" />
              <TableRow label="매도 예정가" value="80,000,000원" />
              <TableRow label="보유 수량" value="1 BTC" />
            </tbody>
          </table>
        </div>

        <div className="my-4 rounded-xl p-5" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <p className="text-[10px] font-medium tracking-wider uppercase text-[var(--accent-red)] mb-3">방치 시 계산</p>
          <table className="w-full text-xs">
            <tbody>
              <TableRow label="의제취득가액" value="max(3,000만, 5,000만) = 5,000만원" />
              <TableRow label="FIFO 패널티 적용" value="5,000만 × (1 - 0.15) = 4,250만원" />
              <TableRow label="양도차익" value="8,000만 - 4,250만 = 3,750만원" />
              <TableRow label="과세표준" value="3,750만 - 250만 = 3,500만원" />
              <TableRow label="납부 세액" value="3,500만 × 22% = 770만원" highlight />
            </tbody>
          </table>
        </div>

        <div className="my-4 rounded-xl p-5" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <p className="text-[10px] font-medium tracking-wider uppercase text-[var(--accent-green)] mb-3">솔루션 적용 시 계산 (국내 이전)</p>
          <table className="w-full text-xs">
            <tbody>
              <TableRow label="의제취득가액" value="max(3,000만, 5,000만) = 5,000만원" />
              <TableRow label="FIFO 패널티" value="없음 (이동평균법 적용)" />
              <TableRow label="양도차익" value="8,000만 - 5,000만 = 3,000만원" />
              <TableRow label="과세표준" value="3,000만 - 250만 = 2,750만원" />
              <TableRow label="납부 세액" value="2,750만 × 22% = 605만원" highlight />
            </tbody>
          </table>
        </div>

        <div className="my-4 rounded-xl p-5 text-center" style={{ backgroundColor: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
          <p className="text-xs text-[var(--text-tertiary)] mb-1">절세 금액</p>
          <p className="font-display text-2xl font-bold text-[var(--accent-green)]">165만원</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">770만원 → 605만원</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-[11px] text-[var(--text-tertiary)] leading-relaxed">
            본 페이지의 내용은 2025년 현재 공개된 세법 및 시행령(안)을 기반으로 작성되었으며,
            실제 시행 시 세부 사항이 변경될 수 있습니다. FIFO 패널티 비율(15%)과 입증 불가 자산 비율(30%)은
            시뮬레이션을 위한 가정치이며, 실제 세무 신고 시에는 전문 세무사와 상담하시기 바랍니다.
          </p>
        </div>

        {/* Back to calculator */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/#calculator"
            className="inline-flex items-center gap-2 rounded-full bg-[#e8e9ed] px-6 py-3 text-sm font-semibold text-[#0c0d14] transition-all duration-200 hover:bg-[#ffffff] hover:text-[#000000] hover:scale-[1.02] active:scale-[0.98]"
          >
            세금 계산하러 가기
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}

import type { TaxResult, UserInput } from '@/types';

function formatKRW(value: number): string {
  if (value === 0) return '0원';
  if (Math.abs(value) >= 100_000_000) {
    return `${(value / 100_000_000).toFixed(1)}억원`;
  }
  if (Math.abs(value) >= 10_000) {
    return `${Math.round(value / 10_000).toLocaleString('ko-KR')}만원`;
  }
  return `${value.toLocaleString('ko-KR')}원`;
}

interface ReportTemplateProps {
  result: TaxResult;
  userInput: UserInput;
}

export default function ReportTemplate({ result, userInput }: ReportTemplateProps) {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const costBasisMethod = userInput.storageLocations.every((l) => l === 'domestic')
    ? '이동평균법'
    : '선입선출법(FIFO)';

  return (
    <div
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        color: '#1a1a2e',
        fontFamily: '"Noto Sans KR", "Apple SD Gothic Neo", Arial, sans-serif',
        padding: '16mm 14mm',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          borderBottom: '3px solid #1a1a2e',
          paddingBottom: '8mm',
          marginBottom: '8mm',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p
              style={{
                fontSize: '9px',
                letterSpacing: '2px',
                color: '#6b7280',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              CRYPTO TAX DIAGNOSIS REPORT
            </p>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: '800',
                color: '#1a1a2e',
                margin: 0,
                letterSpacing: '-0.5px',
              }}
            >
              가상자산 세무 진단 리포트
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>발행일</p>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#374151', margin: '2px 0 0' }}>
              {today}
            </p>
          </div>
        </div>
        <div
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, #ef4444 0%, #f97316 50%, #10b981 100%)',
            marginTop: '6mm',
            borderRadius: '1px',
          }}
        />
      </div>

      {/* 진단 요약 */}
      <section style={{ marginBottom: '7mm' }}>
        <h2
          style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#1a1a2e',
            borderLeft: '3px solid #1a1a2e',
            paddingLeft: '8px',
            marginBottom: '4mm',
          }}
        >
          진단 요약
        </h2>

        {/* 입력 요약 테이블 */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '10px',
            marginBottom: '4mm',
          }}
        >
          <tbody>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '4px 8px', color: '#6b7280', width: '40%' }}>진단 모드</td>
              <td style={{ padding: '4px 8px', fontWeight: '600', color: '#111827' }}>
                {userInput.mode === 'simple' ? '간편 진단' : '정밀 계산'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '4px 8px', color: '#6b7280' }}>보관 위치</td>
              <td style={{ padding: '4px 8px', fontWeight: '600', color: '#111827' }}>
                {userInput.storageLocations
                  .map((l) => (l === 'domestic' ? '국내 거래소' : l === 'overseas' ? '해외 거래소' : 'DeFi'))
                  .join(', ')}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '4px 8px', color: '#6b7280' }}>취득가액 산정 방식</td>
              <td style={{ padding: '4px 8px', fontWeight: '600', color: '#111827' }}>
                {costBasisMethod}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '4px 8px', color: '#6b7280' }}>입증 불가 자산 포함</td>
              <td style={{ padding: '4px 8px', fontWeight: '600', color: '#111827' }}>
                {userInput.hasUnprovableAssets ? '예' : '아니오'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '4px 8px', color: '#6b7280' }}>총 투자 원금</td>
              <td style={{ padding: '4px 8px', fontWeight: '600', color: '#111827' }}>
                {formatKRW(userInput.totalInvestment)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 8px', color: '#6b7280' }}>현재 평가액</td>
              <td style={{ padding: '4px 8px', fontWeight: '600', color: '#111827' }}>
                {formatKRW(userInput.currentValue)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 예상 세액 강조 */}
        <div
          style={{
            background: '#fef2f2',
            border: '1.5px solid #fca5a5',
            borderRadius: '8px',
            padding: '5mm 6mm',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '10px', color: '#dc2626', marginBottom: '4px' }}>
            현재 예상 납부 세액 (방치 시)
          </p>
          <p
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#dc2626',
              fontVariantNumeric: 'tabular-nums',
              margin: 0,
            }}
          >
            {formatKRW(result.currentTax)}
          </p>
          {result.savedTax > 0 && (
            <p style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px', fontWeight: '700' }}>
              솔루션 적용 시 {formatKRW(result.savedTax)} 절세 가능
            </p>
          )}
        </div>
      </section>

      {/* 핵심 리스크 경보 */}
      {userInput.hasUnprovableAssets && (
        <section style={{ marginBottom: '7mm' }}>
          <h2
            style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#1a1a2e',
              borderLeft: '3px solid #ef4444',
              paddingLeft: '8px',
              marginBottom: '4mm',
            }}
          >
            핵심 리스크 경보
          </h2>
          <div
            style={{
              border: '2px solid #ef4444',
              borderRadius: '8px',
              padding: '4mm 5mm',
              background: '#fff5f5',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#dc2626',
                marginBottom: '6px',
              }}
            >
              취득가액 0원 간주 및 증여세 리스크
            </p>
            <p style={{ fontSize: '10px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
              취득 당시 거래 내역을 입증하지 못할 경우 세무 당국이 취득가액을 0원으로 간주할 수
              있습니다. 이 경우 매도 금액 전체가 양도차익으로 산정되어 세금이 대폭 증가합니다.
              또한 무상 취득으로 판단되면 증여세가 추가 부과될 수 있습니다. 반드시 매수 당시
              거래소 내역, 이체 기록, 입금 증빙을 확보하십시오.
            </p>
          </div>
        </section>
      )}

      {/* 맞춤형 Action Plan */}
      <section style={{ marginBottom: '7mm' }}>
        <h2
          style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#1a1a2e',
            borderLeft: '3px solid #10b981',
            paddingLeft: '8px',
            marginBottom: '4mm',
          }}
        >
          맞춤형 Action Plan
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {result.actionPlan.length > 0 ? (
            result.actionPlan.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '5px 0',
                  borderBottom: i < result.actionPlan.length - 1 ? '1px solid #e5e7eb' : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#ffffff',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '1px',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <p style={{ fontSize: '10px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                  {item}
                </p>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '10px', color: '#6b7280' }}>
              현재 입력된 조건에서는 추가 절세 액션이 필요하지 않습니다.
            </p>
          )}
        </div>
      </section>

      {/* 절세 비교표 */}
      <section style={{ marginBottom: '7mm' }}>
        <h2
          style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#1a1a2e',
            borderLeft: '3px solid #1a1a2e',
            paddingLeft: '8px',
            marginBottom: '4mm',
          }}
        >
          절세 비교표
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th
                style={{
                  padding: '6px 8px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                }}
              >
                구분
              </th>
              <th
                style={{
                  padding: '6px 8px',
                  textAlign: 'right',
                  fontWeight: '600',
                  color: '#dc2626',
                  border: '1px solid #e5e7eb',
                }}
              >
                방치 시
              </th>
              <th
                style={{
                  padding: '6px 8px',
                  textAlign: 'right',
                  fontWeight: '600',
                  color: '#16a34a',
                  border: '1px solid #e5e7eb',
                }}
              >
                솔루션 적용 시
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '5px 8px', color: '#374151', border: '1px solid #e5e7eb' }}>
                취득가액
              </td>
              <td
                style={{
                  padding: '5px 8px',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  border: '1px solid #e5e7eb',
                }}
              >
                {formatKRW(result.cost)}
              </td>
              <td
                style={{
                  padding: '5px 8px',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  color: '#16a34a',
                  fontWeight: '600',
                  border: '1px solid #e5e7eb',
                }}
              >
                {formatKRW(result.cost + result.riskAmount)}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '5px 8px', color: '#374151', border: '1px solid #e5e7eb' }}>
                양도차익
              </td>
              <td
                style={{
                  padding: '5px 8px',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  border: '1px solid #e5e7eb',
                }}
              >
                {formatKRW(Math.max(0, result.profit))}
              </td>
              <td
                style={{
                  padding: '5px 8px',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  color: '#16a34a',
                  fontWeight: '600',
                  border: '1px solid #e5e7eb',
                }}
              >
                {formatKRW(Math.max(0, result.profit - result.savedTax / 0.22))}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '5px 8px', color: '#374151', border: '1px solid #e5e7eb' }}>
                과세표준
              </td>
              <td
                style={{
                  padding: '5px 8px',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  border: '1px solid #e5e7eb',
                }}
              >
                {formatKRW(Math.max(0, result.profit - 2_500_000))}
              </td>
              <td
                style={{
                  padding: '5px 8px',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  color: '#16a34a',
                  fontWeight: '600',
                  border: '1px solid #e5e7eb',
                }}
              >
                {formatKRW(result.idealTax / 0.22)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '5px 8px',
                  fontWeight: '700',
                  color: '#111827',
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                }}
              >
                납부세액
              </td>
              <td
                style={{
                  padding: '5px 8px',
                  textAlign: 'right',
                  fontWeight: '700',
                  color: '#dc2626',
                  fontVariantNumeric: 'tabular-nums',
                  border: '1px solid #e5e7eb',
                  background: '#fef2f2',
                }}
              >
                {formatKRW(result.currentTax)}
              </td>
              <td
                style={{
                  padding: '5px 8px',
                  textAlign: 'right',
                  fontWeight: '700',
                  color: '#16a34a',
                  fontVariantNumeric: 'tabular-nums',
                  border: '1px solid #e5e7eb',
                  background: '#f0fdf4',
                }}
              >
                {formatKRW(result.idealTax)}
              </td>
            </tr>
          </tbody>
        </table>
        {result.savedTax > 0 && (
          <p
            style={{
              textAlign: 'right',
              fontSize: '11px',
              color: '#16a34a',
              fontWeight: '700',
              marginTop: '6px',
            }}
          >
            절감 금액: {formatKRW(result.savedTax)}
          </p>
        )}
      </section>

      {/* 면책 조항 */}
      <div
        style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '5mm',
          marginTop: 'auto',
        }}
      >
        <p style={{ fontSize: '8px', color: '#9ca3af', lineHeight: '1.6', margin: 0 }}>
          본 결과는 시뮬레이션이며 법적 효력이 없습니다. 입력하신 정보를 기반으로 한 추정치로,
          실제 세액과 다를 수 있습니다. 실제 신고 시 세무사와 상담하십시오.
          본 리포트는 투자 권유 또는 세무 조언을 목적으로 하지 않습니다.
        </p>
      </div>
    </div>
  );
}

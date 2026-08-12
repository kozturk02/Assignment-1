import { calculateQuote } from './calculateQuote';
import { LHC_STATEMENT } from './pricingConfig';

function formatMoney(amount) {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPercent(value) {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`;
}

function QuoteModal({ record, onClose }) {
  const quote = calculateQuote(record);
  const headerLabel = quote.isYearly
    ? 'Final estimated yearly premium'
    : 'Final estimated monthly premium';

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Quote details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-scroll">
          <div className="quote-hero">
            <div className="quote-hero-label">{headerLabel}</div>
            <div className="quote-hero-amount">{formatMoney(quote.finalTotal)}</div>
          </div>

          <div className="quote-lines">
            <div className="quote-line">
              <span>Hospital cover ({quote.hospitalCoverLevel}) x{quote.adultCount} Adult(s)</span>
              <span>{formatMoney(quote.hospitalCoverPrice)}</span>
            </div>
            <div className="quote-line">
              <span>Extras premium ({quote.extrasCoverLevel}) x{quote.adultCount} Adult(s)</span>
              <span>{formatMoney(quote.extrasCoverPrice)}</span>
            </div>
            {quote.familyFee > 0 && (
              <div className="quote-line">
                <span>Family upgrade fee</span>
                <span>{formatMoney(quote.familyFee)}</span>
              </div>
            )}

            <div className="quote-line-divider" />

            <div className="quote-line">
              <span>Applicant 1 LHC loading</span>
              <span>{formatPercent(quote.applicant1LoadingPercent)}</span>
            </div>
            {quote.applicant2LoadingPercent !== null && (
              <div className="quote-line">
                <span>Applicant 2 LHC loading</span>
                <span>{formatPercent(quote.applicant2LoadingPercent)}</span>
              </div>
            )}
            <div className="quote-line-divider" />

            <div className="quote-line">
              <span>Estimated monthly premium</span>
              <span>{formatMoney(quote.monthlyCost)}</span>
            </div>
            <div className="quote-line">
              <span>Estimated Yearly cost</span>
              {quote.isMonthly && (
                <span>{formatMoney(quote.yearlyCost)}</span>
              )}
              {quote.isYearly && (
                <span><s>{formatMoney(quote.yearlyCost)}</s></span>
              )}
            </div>

            {quote.isYearly && (
              <>
                <div className="quote-line">
                  <span style="padding-left: 12px;">Yearly discount ({formatPercent(quote.discountPercent)})</span>
                  <span>-{formatMoney(quote.discountAmount)}</span>
                </div>
                <div className="quote-line">
                  <span style="padding-left: 12px;">Discounted yearly cost</span>
                  <span>{formatMoney((quote.yearlyCost - quote.discountAmount))}</span>
                </div>
              </>
            )}

            <div className="quote-line-divider" />

            <div className="quote-line quote-line-final">
              <span>Final total</span>
              <span>{formatMoney(quote.finalTotal)}</span>
            </div>
          </div>
          <div className="quote-box quote-box-info">
            <div className="quote-box-title">ⓘ LHC required statement</div>
            <p>{LHC_STATEMENT}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuoteModal;
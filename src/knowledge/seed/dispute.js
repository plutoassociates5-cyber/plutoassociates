const S = (category, question, answer, keywords) => ({
  category, question, answer,
  keywords: keywords.split('|').map((k) => k.trim()).filter(Boolean),
});

export const disputeSeed = [
  S('litigation',
    'How do I resolve a commercial dispute without going to court in Nepal?',
    'Commercial disputes in Nepal need not go to court, and for many matters they should not. Options include direct negotiation, mediation and other consensual processes that let the parties keep control of the outcome and the cost, and arbitration, where the parties agree on a private decision‑maker whom they bind themselves to the result. Which route fits depends on the dispute, the relationship and the contract (some agreements already name the forum). A well‑drafted agreement often points the parties to a specific alternative before a court is involved. We help you read the forum that fits your dispute and negotiate or arbitrate accordingly, so you resolve it with less cost and less breakage of the relationship.',
    'resolve a commercial dispute without court|mediation vs arbitration nepal|settle dispute out of court'),
  S('arbitration',
    'What is arbitration and does it apply in Nepal?',
    'Arbitration is a process in which the parties agree to have a private third party (the arbitrator) decide their dispute instead of a court, and the award is binding on them. In Nepal, arbitration is recognised and governs any agreement to arbitrate and the procedure followed. It is often chosen to keep a dispute private and to allow a specialist decision, and it can, in the right terms, be faster than the courts. Whether your agreement submits to arbitration depends on the contract, in the same way parties choose arbitration. We advise on arbitration clauses at drafting, and on running or resisting an arbitration when a dispute is already there, so the agreed process is followed.',
    'what is arbitration in nepal|arbitration vs court nepal|arbitration clause nepal'),
  S('debt-recovery',
    'How do I recover unpaid business debts in Nepal?',
    'Recovering an unpaid debt in Nepal begins with the documentation: the loan agreement, the invoice, or any acknowledgment of the debt, that proves the amount owed and the obligation to pay. Recovery options range from a formal demand and a settlement negotiated under a written repayment, to enforcement of the debt through the appropriate legal procedure against the party and its assets. The law generally requires clear proof of the debt and the correct route; from there, enforcement depends on the facts and on what the debtor holds. The longer money remains unpaid, the harder it often is to recover. We help you document, demand and, where necessary, take recovery steps as efficiently as they can be taken.',
    'recover unpaid business debts nepal|debt recovery kathmandu|money recovery legal'),
  S('litigation',
    'How do I start a civil or commercial case in Nepal?',
    'Starting a civil or a commercial case in Nepal begins with establishing whether you have a legal claim, where it should be brought, and whether it is still within time. You then prepare the case, setting out the background, the legal basis and the kind of relief you ask for, supported by evidence. Procedure, more than the facts, is where most matters go wrong, since a file that does not follow the relevant procedure and format will be returned to fix again. We advise whether a claim is worth pursuing, the correct forum and the prospects, and we prepare and present the case. We are clear also when a claim should not be brought, since litigation is not always the best answer.',
    'start a civil case nepal|commercial litigation kathmandu|file a court case nepal'),
  S('debt-recovery',
    'What is a debt recovery demand notice and why does it matter?',
    'A demand notice is a formal written notice informing the debtor that an invoice or loan is due, that a sum must be paid by a date, and the intended next step if it is not paid. It matters because it is the evidence that you complied with the notice requirement, it gives the debtor a chance with a deadline, and it often recovers the money without the cost of a case. The legality of the demand depends on the underlying agreement and the debt. We can prepare and serve a proper demand on your behalf, and advise on the next step if it does not work, so you are not left chasing the matter informally.',
    'debt demand letter nepal|formal demand for payment|recover money legally'),
];
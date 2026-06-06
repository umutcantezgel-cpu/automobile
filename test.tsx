boxShadow: '0 0 0 1px color-mix(in srgb, var(--color-gold-600) 30%, transparent), 0 4px 12px color-mix(in srgb, var(--color-gold-600) 10%, transparent)'
border: `2px solid ${priceRatingKey === opt.key ? opt.color : 'var(--color-border-strong)'}`,
backdropFilter: 'blur(12px)',
borderTop: '1px solid var(--color-border)',
padding: '16px 28px',
letterSpacing: '0.02em',
border: '1px solid var(--color-border)',
border: '2px solid var(--color-background)',
margin: "-100px"
'linear-gradient(color-mix(in srgb, var(--color-off-white-50) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-off-white-50) 6%, transparent) 1px, transparent 1px)',
backgroundSize: '40px 40px',
gridTemplateColumns: `200px repeat(${canAdd ? vehicles.length + 1 : vehicles.length}, 1fr)`,

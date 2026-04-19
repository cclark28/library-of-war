'use client'

export default function DonorBoxWidget() {
  return (
    <div className="w-full">
      <iframe
        src="https://donorbox.org/embed/library-of-war-operations?default_interval=o"
        name="donorbox"
        seamless
        scrolling="no"
        frameBorder={0}
        allow="payment"
        style={{
          maxWidth: '500px',
          minWidth: '250px',
          maxHeight: 'none',
          width: '100%',
          height: '900px',
          border: 'none',
        }}
        title="Support Library of War"
      />
    </div>
  )
}

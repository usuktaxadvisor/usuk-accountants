import { Header, Footer, Container, Button } from '@/components/library';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-white py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-prose text-center">
            <p className="font-display text-6xl font-semibold text-gold">404</p>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">
              We couldn&rsquo;t find that page
            </h1>
            <p className="mt-4 text-muted">
              The page may have moved. Try our services, resources, or get in touch and we&rsquo;ll point you the right way.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button href="/">Back to home</Button>
              <Button href="/contact" variant="secondary">Contact us</Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

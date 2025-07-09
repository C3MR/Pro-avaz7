import NewRequestForm from '@/components/forms/NewRequestForm';

export default function NewRequestPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* The main title and subtitle from the HTML form model will be part of the NewRequestForm component */}
      <NewRequestForm />
    </div>
  );
}

import { RolePlaceholder } from '@/components/RolePlaceholder';

export default function VerifiedResponderPage() {
  return (
    <RolePlaceholder
      role="verified_responder"
      icon="group"
      purpose="A verified first aider or clinic nurse nearby who can reach the scene before an ambulance. Deliberately the most restricted role: location and the fact that help is needed, not the patient's medical record."
      wouldSee={[
        'Nearby emergencies they have been asked to attend',
        'Location and access notes, without the medical summary',
        'Nearest registered AED',
        'Accept, decline, and on-scene arrival',
      ]}
    />
  );
}

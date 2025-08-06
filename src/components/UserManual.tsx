import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Play,
  CheckCircle,
  ArrowRight,
  Mouse,
  Search,
  BookOpen,
  Users,
  HelpCircle,
  Star,
  Navigation as NavigationIcon
} from 'lucide-react';
import MainT from '../assets/UserJourney.jpeg';

interface UserManualProps {
  onBack: () => void;
}
import Footer from './Footer';
const UserManual: React.FC<UserManualProps> = ({ onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      id: 1,
      title: 'Step 1: Land on Homepage',
      icon: Play,
      description: 'Start your journey from the homepage',
      content: [
        'Welcome to the ICT Faculty Information Application',
        'This is your starting point to explore the system'
      ]
    },
    {
      id: 2,
      title: 'Step 2: Select Your Level of Study',
      icon: Users,
      description: 'Use the navigation bar to filter services',
      content: [
        'Use the burger menu on the top left of the navigation bar',
        'Select your level of study: Senior Students, Newcomer Students, or All Students',
        'This will filter the services relevant to you'
      ]
    },
    {
      id: 3,
      title: 'Step 3: Search for a Topic or Service',
      icon: Search,
      description: 'Use the search bar to find what you need',
      content: [
        'Type a department or service name into the search bar in the navigation',
        'Search results will appear below the bar as interactive cards'
      ]
    },
    {
      id: 4,
      title: 'Step 4: Select a Topic or Card',
      icon: BookOpen,
      description: 'Click a result card to view more information',
      content: [
        'After searching, click on the card that best matches your topic',
        'You will be directed to a detailed page or view with more information'
      ]
    },
    {
      id: 5,
      title: 'Step 5: Explore Quick Links for Help',
      icon: Mouse,
      description: 'Use quick links and additional resources',
      content: [
        'Scroll down or check quick links for external websites and further resources',
        'These links provide direct access to forms, registration, and more'
      ]
    },
    {
      id: 6,
      title: 'Step 6: Contact Us',
      icon: HelpCircle,
      description: 'Get in touch with support for more help',
      content: [
        'Use the contact details listed on the website for email or phone support',
        'Our support team is available during working hours to assist you'
      ]
    }
  ];

  const handleStepClick = (stepId: number) => {
    setActiveStep(activeStep === stepId ? null : stepId);
  };

  const markStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const quickTips = [
    'Use keyboard navigation for accessibility',
    'Bookmark frequently used services',
    'Check the website regularly for updates',
    'Contact support if you encounter any issues'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl mr-6">
                <NavigationIcon className="w-12 h-12 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">User Guide</h1>
                <p className="text-xl text-gray-600">Learn how to navigate and use the ICT Faculty Information Hub</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-2 mb-8">
              <div
                className="bg-gradient-to-r from-blue-600 to-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progress: {completedSteps.length} of {steps.length} steps completed</span>
              <span className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                {completedSteps.length === steps.length ? 'Expert User!' : 'Keep Learning'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{ transitionDelay: '200ms' }}>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Step-by-Step Guide</h2>

                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isActive = activeStep === step.id;
                    const isCompleted = completedSteps.includes(step.id);

                    return (
                      <div
                        key={step.id}
                        className={`border rounded-xl overflow-hidden transition-all duration-500 ${isActive ? 'border-blue-300 shadow-lg' : 'border-gray-200 hover:border-blue-200'
                          } ${isCompleted ? 'bg-green-50' : 'bg-white'}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <div
                          className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                          onClick={() => handleStepClick(step.id)}
                        >
                          <div className="flex items-center">
                            <div className={`p-3 rounded-lg mr-4 transition-all duration-300 ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-100'
                              }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                              ) : (
                                <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'
                                  }`} />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                              <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                          </div>
                          <ArrowRight className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isActive ? 'rotate-90' : ''
                            }`} />
                        </div>

                        <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}>
                          <div className="px-6 pb-6 border-t border-gray-100">
                            <div className="pt-4">
                              <ul className="space-y-3">
                                {step.content.map((item, itemIndex) => (
                                  <li key={itemIndex} className="flex items-start">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span className="text-gray-700">{item}</span>
                                  </li>
                                ))}
                              </ul>

                              {!isCompleted && (
                                <button
                                  onClick={() => markStepComplete(step.id)}
                                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark as Complete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* User Journey Button */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {/* <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Link</h3> */}
              <a
                href={MainT}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-2 bg-blue-600 font-mid bold text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                View User Journey
              </a>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Tips</h3>
              <div className="space-y-3">
                {quickTips.map((tip, index) => (
                  <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="bg-yellow-400 rounded-xl shadow-lg p-6 mt-6 text-blue-900">
              <h3 className="text-xl font-bold mb-4">Need More Help?</h3>
              <p className="mb-4 text-sm">
                If you're still having trouble navigating the website, don't hesitate to contact our support team.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">012 382 9500</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">admission@tut.ac.za</span>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserManual;

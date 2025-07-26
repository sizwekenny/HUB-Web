import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Play, 
  CheckCircle, 
  ArrowRight, 
  Mouse, 
  Smartphone, 
  Search,
  BookOpen,
  Users,
  HelpCircle,
  Star,
  Navigation as NavigationIcon
} from 'lucide-react';

interface UserManualProps {
  onBack: () => void;
}

const UserManual: React.FC<UserManualProps> = ({ onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const steps = [
    {
      id: 1,
      title: 'Getting Started',
      icon: Play,
      description: 'Learn how to navigate the ICT Faculty Information Hub',
      content: [
        'Welcome to the ICT Faculty Information Application',
        'Use the navigation bar at the top to move between sections',
        'Click on the logo to return to the homepage anytime',
        'The website is fully responsive and works on all devices'
      ]
    },
    {
      id: 2,
      title: 'Exploring Departments',
      icon: BookOpen,
      description: 'Discover academic departments and their programs',
      content: [
        'Browse the 4 main academic departments on the homepage',
        'Click on any department card to view detailed information',
        'Each department shows available course codes and descriptions',
        'Use the expandable sections to learn more about specific programs'
      ]
    },
    {
      id: 3,
      title: 'Finding Student Services',
      icon: Users,
      description: 'Access support services for your academic journey',
      content: [
        'Student services are categorized by student type (Senior, Newcomer, All)',
        'Click on any service card to view detailed instructions',
        'Follow the step-by-step processes provided',
        'Contact information is available for additional support'
      ]
    },
    {
      id: 4,
      title: 'Using Interactive Features',
      icon: Mouse,
      description: 'Make the most of the website\'s interactive elements',
      content: [
        'Hover over cards and buttons to see smooth animations',
        'Click on expandable sections to reveal more information',
        'Use the search functionality to quickly find what you need',
        'All animations are designed to enhance your experience'
      ]
    },
    {
      id: 5,
      title: 'Mobile Experience',
      icon: Smartphone,
      description: 'Access the website seamlessly on mobile devices',
      content: [
        'The website automatically adapts to your screen size',
        'Use the hamburger menu on mobile for navigation',
        'All features work perfectly on tablets and smartphones',
        'Touch-friendly interface for easy mobile interaction'
      ]
    },
    {
      id: 6,
      title: 'Getting Help',
      icon: HelpCircle,
      description: 'Find support when you need it most',
      content: [
        'Contact information is always visible in the navigation bar',
        'Each service page includes specific contact details',
        'Use the provided phone numbers and email addresses',
        'Visit the specified office locations for in-person assistance'
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
          
          <div className={`transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
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
            <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
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
                        className={`border rounded-xl overflow-hidden transition-all duration-500 ${
                          isActive ? 'border-blue-300 shadow-lg' : 'border-gray-200 hover:border-blue-200'
                        } ${isCompleted ? 'bg-green-50' : 'bg-white'}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <div
                          className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                          onClick={() => handleStepClick(step.id)}
                        >
                          <div className="flex items-center">
                            <div className={`p-3 rounded-lg mr-4 transition-all duration-300 ${
                              isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-100'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                              ) : (
                                <IconComponent className={`w-6 h-6 ${
                                  isActive ? 'text-white' : 'text-gray-600'
                                }`} />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                              <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                          </div>
                          <ArrowRight className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
                            isActive ? 'rotate-90' : ''
                          }`} />
                        </div>
                        
                        <div className={`overflow-hidden transition-all duration-500 ${
                          isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
            {/* Quick Tips */}
            <div className={`bg-white rounded-xl shadow-lg p-6 mb-6 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '400ms' }}>
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

            {/* Navigation Overview */}
            <div className={`bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '600ms' }}>
              <h3 className="text-xl font-bold mb-4">Navigation Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-900 font-bold text-sm">1</span>
                  </div>
                  <span className="text-sm">Use the top navigation bar</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-900 font-bold text-sm">2</span>
                  </div>
                  <span className="text-sm">Click on cards to explore</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-900 font-bold text-sm">3</span>
                  </div>
                  <span className="text-sm">Use back buttons to return</span>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className={`bg-yellow-400 rounded-xl shadow-lg p-6 mt-6 text-blue-900 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '800ms' }}>
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
    </div>
  );
};

export default UserManual;
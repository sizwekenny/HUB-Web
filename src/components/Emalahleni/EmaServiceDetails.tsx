import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Service } from '../../types';
import Footer from '../Emalahleni/EmaFooter';

interface ServiceDetailsProps {
  service: Service;
  onBack: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service, onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Senior Students':
        return 'bg-blue-100 text-blue-800';
      case 'Newcomer Students':
        return 'bg-green-100 text-green-800';
      case 'All Students':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceSteps = (serviceId: string) => {
    const steps: Record<string, string[]> = {
      'mark-enquiries': [
        'Contact your Academic Department directly for all Marks and predicate enquiries ',
      ],
      'academic-exclusions': [
        'Get appeal forms from the Student Support Coordinator office in building 14 and complete them.',
        'You are then required to submit your appeals by handing in a hard copy exclusion appeal form together with the relevant supporting documents',
        
      ],
      'nsfas-enquiries': [
        'Visit the Financial Aid Office for enquiries',
        'Find your propensity letter form from Financial Aid Office',
        'Take form to your Academic Department',
        'Get signatures from OneStop',
        'Visit NSFAS website for other issues',
      ],
      'change-of-course': [
        'Confirm you were registered the previous academic year',
        'Apply via EC (Electronic Campus) during October/November',
        'Wait for approval email',
        'Cancel your current course first',
        'Register for the new course',
        'Visit Academic Department for module credits',
      ],
      'Subject additions and cancellations': [
        'Go to building 7',
       
      ],
      'NO WALK-INS Policy': [
        'NO HUMANITIES ENQUIRIES at ICT Faculty offices',
        'Do not ask staff to screen grade 12 certificate',
        'Must apply online only',
        'Check www.tut.ac.za daily for available courses',
      ],
      'Intercampus Transfers': [
        'Must be registered Computer Science Student',
        'Apply via EC (electronic Campus)',
        'Available end of October to mid-November only',
        'One intake per year only',
      ],
      'Re-admission': [
        'Had a break in studies? Get form from Building 7',
      
      ],
      'Special & Exit Examinations': [
        'Go to Building 7',
      ],
      'Probation': ['Get appeal forms from the Student Support Coordinator office in building 14 and complete them.',
      'submit their appeals by handing in a hard copy probation appeal form together with the relevant supporting documents'],
      
      'ema Other Admissions Enquiries': [
        'Via email – admission@tut.ac.za or Via a phone call – 0861102421 or just visit building 7',
        
      ],
      'Residence Administration': [
        'visit Building 7',
        
      ],
      'bursaries': [
        'Visit the FUNDI office in building 7',
        
      ],
      'Recognition / Examption (CAT)': ['Obtain approvals from your Academic Department.'],
      'admissions': ['Visit www.tut.ac.za to check application closing dates', 'Use the Quick link provided to apply online'],
      
      'financial-exclusion': ['Refer to the ITS notification.',
        
      ],
      'academicc-exclusions': ['Get appeal forms from the Student Support Coordinator office in building 14 and complete them.',
      'Submit the completed forms to the Exclusion Appeal Committee  office in building 14 before the closing date.',

      ],
      'WIL For Compuer Science': [
        'Download WIL and Re-admission forms from EC and complete them.',
        'Send the placement letter along with the completed forms to the WIL manager (JK Makhubela, MakhubelaJK@tut.ac.za)',
        'The manager will process the forms and send them back, for the student to proceed with WIL registration.',
        'Take the forms and placement letter to the registration office (BLD 7)',
        'Send the proof of registration from the registration office back to the manager.',
        'The manager assigns the student a WIL Coordinator.',
        'Proceed to MY WIL PORTAL and register (refer to the student user manual guide on MYTutor).) https://wil.tut.ac.za/ ',
        'Step 8	The manager will approve your registration.',
      ],
      'class timetables': [
        'Go to building 7',
        'If you experience clashes on the timetables, visit your Academic Department urgently',
      ],
      'no-walk-ins':[
        'Do not visit any office and ask staff to screen your grade 12 certificate.',
        'You must apply on-line.',
        'click on the quick link daily to see which courses are available if you did not apply earlier or if you want to apply late.',

      ],
      'admission': [
   'Visit the TUT website to check application closing dates (www.tut.ac.za) use the quick link',
      ],
    };
    return steps[serviceId] || [];
  };

  const steps = getServiceSteps(service.id);

  const markStepComplete = (stepIndex: number) => {
    // If already completed, do nothing here — unmarking handled separately
    if (!completedSteps.includes(stepIndex)) {
      // Only allow marking step if it is the next in order or any previous (optional, if you want strict order)
      // But here just add it for simplicity
      setCompletedSteps([...completedSteps, stepIndex].sort((a, b) => a - b));
    }
  };

  const unmarkStepComplete = (stepIndex: number) => {
    // Only allow unmark if stepIndex is the highest completed step
    if (
      completedSteps.length > 0 &&
      stepIndex === Math.max(...completedSteps)
    ) {
      setCompletedSteps(completedSteps.filter((step) => step !== stepIndex));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16" style={{ paddingTop: '0px' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          <div
            className={`transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="flex items-center mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold mr-4 ${getCategoryColor(service.category)}`}>
                {service.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>
            <p className="text-xl text-gray-600">{service.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div
              className={`bg-white rounded-xl shadow-lg p-8 transform transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Information</h2>

              <div className="prose max-w-none">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800">{service.details}</p>
                    </div>
                  </div>
                </div>

                {steps.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Step-by-Step Process</h3>
                    <div className="space-y-4">
                      {steps.map((step, index) => {
                        const isActive = expandedSection === `step-${index}`;
                        const isCompleted = completedSteps.includes(index);
                        const highestCompleted = completedSteps.length > 0 ? Math.max(...completedSteps) : -1;

                        return (
                          <div
                            key={index}
                            className={`flex flex-col rounded-xl border transition-all duration-500 cursor-pointer ${
                              isCompleted
                                ? 'bg-green-50 border-green-400 shadow-md'
                                : isActive
                                ? 'border-blue-300 bg-blue-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50'
                            }`}
                          >
                            <button
                              type="button"
                              className="flex items-center justify-between p-4"
                              onClick={() => setExpandedSection(isActive ? null : `step-${index}`)}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4 ${
                                    isCompleted
                                      ? 'bg-green-500 text-white'
                                      : isActive
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <p className="text-gray-900 font-medium">{step}</p>
                              </div>
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              ) : (
                                <ArrowRight
                                  className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
                                    isActive ? 'rotate-90' : ''
                                  }`}
                                />
                              )}
                            </button>

                            <div
                              className={`px-6 pb-6 border-t border-gray-200 overflow-hidden transition-all duration-500 ${
                                isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                              }`}
                            >
                              {!isCompleted && (
                                <button
                                  onClick={() => markStepComplete(index)}
                                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark as Complete
                                </button>
                              )}
                              {isCompleted && (
                                <button
                                  onClick={() => {
                                    if (index === highestCompleted) unmarkStepComplete(index);
                                  }}
                                  className={`mt-4 px-4 py-2 rounded-lg flex items-center font-semibold ${
                                    index === highestCompleted
                                      ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  }`}
                                  disabled={index !== highestCompleted}
                                  title={
                                    index === highestCompleted
                                      ? 'Click to unmark this step'
                                      : 'Cannot unmark this step until later steps are unmarked'
                                  }
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Unmark Step
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div
              className={`bg-white rounded-xl shadow-lg p-6 transform transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                {service.statusLink ? (
                  <a
                    href={service.statusLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-yellow-400 text-blue-900 font-semibold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors duration-300 flex items-center justify-center"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Quick Link
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 font-semibold py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    No Link Available
                  </button>
                )}
              </div>
            </div>

            <div
              className={`bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg p-6 mt-6 text-blue-900 transform transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>012 382 9500</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>admission@tut.ac.za</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>Building 5</span>
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

export default ServiceDetails;

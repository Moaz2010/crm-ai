"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building,
  Globe,
  MapPin,
  Users,
  Phone,
  Mail,
  Edit,
  Trash2,
  Plus,
  ExternalLink,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  phone?: string;
  email?: string;
  description?: string;
  revenue?: string;
  founded?: string;
  linkedIn?: string;
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
  deals: Array<{
    id: string;
    name: string;
    value: number;
    stage: string;
  }>;
  activities: Array<{
    id: string;
    type: string;
    description: string;
    date: string;
  }>;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "deals" | "activity">("overview");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/companies/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setCompany(data);
        } else {
          // Mock data for demo
          setCompany({
            id: params.id as string,
            name: "Acme Corporation",
            website: "https://acme.com",
            industry: "Technology",
            size: "50-200 employees",
            location: "San Francisco, CA",
            phone: "+1 (555) 123-4567",
            email: "info@acme.com",
            description: "Acme Corporation is a leading provider of innovative technology solutions for businesses worldwide.",
            revenue: "$10M - $50M",
            founded: "2015",
            linkedIn: "https://linkedin.com/company/acme",
            contacts: [
              { id: "1", name: "John Smith", email: "john@acme.com", role: "CEO" },
              { id: "2", name: "Jane Doe", email: "jane@acme.com", role: "CTO" },
              { id: "3", name: "Bob Wilson", email: "bob@acme.com", role: "Sales Director" },
            ],
            deals: [
              { id: "1", name: "Enterprise License", value: 50000, stage: "Negotiation" },
              { id: "2", name: "Support Package", value: 12000, stage: "Proposal" },
            ],
            activities: [
              { id: "1", type: "call", description: "Discovery call with John Smith", date: "2024-01-20" },
              { id: "2", type: "email", description: "Sent proposal document", date: "2024-01-18" },
              { id: "3", type: "meeting", description: "Product demo", date: "2024-01-15" },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      await fetch(`/api/companies/${params.id}`, { method: "DELETE" });
      router.push("/companies");
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Company not found</p>
        <Link href="/companies" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to Companies
        </Link>
      </div>
    );
  }

  const totalDealValue = company.deals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="p-6 space-y-6">
      <Link
        href="/companies"
        className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Companies
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {company.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              {company.industry && <span>{company.industry}</span>}
              {company.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Users className="h-4 w-4" />
            <span className="text-sm">Contacts</span>
          </div>
          <p className="text-2xl font-bold">{company.contacts.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Active Deals</span>
          </div>
          <p className="text-2xl font-bold">{company.deals.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Deal Value</span>
          </div>
          <p className="text-2xl font-bold">${(totalDealValue / 1000).toFixed(0)}k</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Activities</span>
          </div>
          <p className="text-2xl font-bold">{company.activities.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-zinc-800">
        <div className="flex gap-8">
          {(["overview", "contacts", "deals", "activity"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === "overview" && (
          <>
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <h2 className="text-lg font-semibold mb-4">About</h2>
                <p className="text-gray-600 dark:text-gray-400">{company.description}</p>
              </div>

              <div className="p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {company.activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <h2 className="text-lg font-semibold mb-4">Company Details</h2>
                <div className="space-y-4">
                  {company.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {company.website.replace("https://", "")}
                      </a>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">
                        {company.email}
                      </a>
                    </div>
                  )}
                  {company.size && (
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span>{company.size}</span>
                    </div>
                  )}
                  {company.revenue && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <span>{company.revenue}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "contacts" && (
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Contacts ({company.contacts.length})</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90">
                <Plus className="h-4 w-4" />
                Add Contact
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {company.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      {contact.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.role}</p>
                    </div>
                  </div>
                  <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline">
                    {contact.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "deals" && (
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Deals ({company.deals.length})</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90">
                <Plus className="h-4 w-4" />
                Add Deal
              </button>
            </div>
            <div className="space-y-4">
              {company.deals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{deal.name}</p>
                    <p className="text-sm text-gray-500">{deal.stage}</p>
                  </div>
                  <p className="text-lg font-bold">${deal.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
            <div className="space-y-4">
              {company.activities.map((activity, index) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    {index < company.activities.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 dark:bg-zinc-800 mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

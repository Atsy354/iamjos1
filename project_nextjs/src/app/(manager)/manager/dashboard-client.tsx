"use client";

import Link from "next/link";
import { FileText, Users, CheckCircle, XCircle, Clock, Eye, Edit } from "lucide-react";

type ManagerStats = {
  totalSubmissions: number;
  inReview: number;
  inCopyediting: number;
  inProduction: number;
  published: number;
  declined: number;
  totalUsers: number;
  recentSubmissions: Array<{
    id: string;
    title: string | null;
    status: string;
    current_stage: string;
    submitted_at: string | null;
    updated_at: string | null;
  }>;
};

type Props = {
  stats: ManagerStats;
};

export function ManagerDashboardClient({ stats }: Props) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bgColor: string; textColor: string; borderColor: string; label: string }> = {
      published: { bgColor: '#d4edda', textColor: '#155724', borderColor: '#c3e6cb', label: "Published" },
      declined: { bgColor: '#f8d7da', textColor: '#721c24', borderColor: '#f5c6cb', label: "Declined" },
      accepted: { bgColor: '#d4edda', textColor: '#155724', borderColor: '#c3e6cb', label: "Accepted" },
      submitted: { bgColor: '#e2e3e5', textColor: '#383d41', borderColor: '#d6d8db', label: "Submitted" },
      in_review: { bgColor: 'transparent', textColor: '#383d41', borderColor: '#dee2e6', label: "In Review" },
    };

    const config = variants[status] || { bgColor: '#e2e3e5', textColor: '#383d41', borderColor: '#d6d8db', label: status };
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '0.25rem'
      }}>
        {config.label}
      </span>
    );
  };

  const getStageBadge = (stage: string) => {
    const stageLabels: Record<string, string> = {
      submission: "Submission",
      review: "Review",
      copyediting: "Copyediting",
      production: "Production",
    };
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: 'transparent',
        color: '#383d41',
        border: '1px solid #dee2e6',
        borderRadius: '0.25rem'
      }}>
        {stageLabels[stage] || stage}
      </span>
    );
  };

  return (
    <div style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Page Header - OJS PKP 3.3 Style */}
      <div>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#002C40',
          margin: 0,
          marginBottom: '0.25rem'
        }}>
          Journal Manager Dashboard
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#666',
          margin: 0
        }}>
          Overview of your journal's editorial workflow
        </p>
      </div>

      {/* Statistics Cards - OJS PKP 3.3 Style */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#4b5563'
            }}>
              Total Submissions
            </span>
            <FileText style={{ height: '1rem', width: '1rem', color: '#9ca3af' }} />
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '0.25rem'
          }}>
            {stats.totalSubmissions}
          </div>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: 0
          }}>
            All submissions
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#4b5563'
            }}>
              In Review
            </span>
            <Clock style={{ height: '1rem', width: '1rem', color: '#9ca3af' }} />
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#ea580c',
            marginBottom: '0.25rem'
          }}>
            {stats.inReview}
          </div>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: 0
          }}>
            Under review
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#4b5563'
            }}>
              Published
            </span>
            <CheckCircle style={{ height: '1rem', width: '1rem', color: '#9ca3af' }} />
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#16a34a',
            marginBottom: '0.25rem'
          }}>
            {stats.published}
          </div>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: 0
          }}>
            Published articles
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#4b5563'
            }}>
              Total Users
            </span>
            <Users style={{ height: '1rem', width: '1rem', color: '#9ca3af' }} />
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#2563eb',
            marginBottom: '0.25rem'
          }}>
            {stats.totalUsers}
          </div>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: 0
          }}>
            Registered users
          </p>
        </div>
      </div>

      {/* Additional Stats Row - OJS PKP 3.3 Style */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '1rem'
        }}>
          <div style={{
            marginBottom: '0.75rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#4b5563'
            }}>
              In Copyediting
            </span>
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#9333ea'
          }}>
            {stats.inCopyediting}
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '1rem'
        }}>
          <div style={{
            marginBottom: '0.75rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#4b5563'
            }}>
              In Production
            </span>
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#4f46e5'
          }}>
            {stats.inProduction}
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '1rem'
        }}>
          <div style={{
            marginBottom: '0.75rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#4b5563'
            }}>
              Declined
            </span>
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#dc2626'
          }}>
            {stats.declined}
          </div>
        </div>
      </div>

      {/* Recent Submissions - OJS PKP 3.3 Style */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #f3f4f6'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#111827',
              margin: 0,
              marginBottom: '0.25rem'
            }}>
              Recent Submissions
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#4b5563',
              margin: 0
            }}>
              Latest submissions in your journal
            </p>
          </div>
          <Link
            href="/manager/submissions"
            style={{
              fontSize: '0.875rem',
              color: '#006798',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            View All
          </Link>
        </div>
        <div>
          {stats.recentSubmissions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#6b7280'
            }}>
              <p style={{ margin: 0 }}>No submissions yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  style={{
                    border: '1px solid #f3f4f6',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: '1rem' }}>
                      <h4 style={{
                        fontWeight: 500,
                        color: '#111827',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        margin: 0,
                        marginBottom: '0.25rem'
                      }}>
                        {submission.title || "Untitled Submission"}
                      </h4>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        margin: 0
                      }}>
                        Updated: {formatDate(submission.updated_at)}
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexShrink: 0
                    }}>
                      {getStatusBadge(submission.status)}
                      {getStageBadge(submission.current_stage)}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.75rem'
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      Submitted: {formatDate(submission.submitted_at)}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link
                        href={`/manager/submissions/${submission.id}`}
                        style={{
                          fontSize: '0.75rem',
                          color: '#006798',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = 'none';
                        }}
                      >
                        <Eye style={{ height: '0.75rem', width: '0.75rem' }} />
                        <span>View</span>
                      </Link>
                      <Link
                        href={`/editor/submissions/${submission.id}`}
                        style={{
                          fontSize: '0.75rem',
                          color: '#006798',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = 'none';
                        }}
                      >
                        <Edit style={{ height: '0.75rem', width: '0.75rem' }} />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions - OJS PKP 3.3 Style */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '1.5rem'
      }}>
        <div style={{
          marginBottom: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #f3f4f6'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827',
            margin: 0
          }}>
            Quick Actions
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem'
        }}>
          <Link
            href="/manager/submissions"
            style={{
              padding: '1rem',
              border: '1px solid #dee2e6',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{
              fontWeight: 500,
              color: '#111827',
              fontSize: '0.875rem',
              marginBottom: '0.25rem'
            }}>
              View All Submissions
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              Manage editorial workflow
            </div>
          </Link>
          <Link
            href="/manager/users"
            style={{
              padding: '1rem',
              border: '1px solid #dee2e6',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{
              fontWeight: 500,
              color: '#111827',
              fontSize: '0.875rem',
              marginBottom: '0.25rem'
            }}>
              Manage Users
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              Assign roles and permissions
            </div>
          </Link>
          <Link
            href="/manager/settings"
            style={{
              padding: '1rem',
              border: '1px solid #dee2e6',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{
              fontWeight: 500,
              color: '#111827',
              fontSize: '0.875rem',
              marginBottom: '0.25rem'
            }}>
              Journal Settings
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              Configure journal options
            </div>
          </Link>
          <Link
            href="/manager/statistics"
            style={{
              padding: '1rem',
              border: '1px solid #dee2e6',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{
              fontWeight: 500,
              color: '#111827',
              fontSize: '0.875rem',
              marginBottom: '0.25rem'
            }}>
              View Statistics
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              Reports and analytics
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}



